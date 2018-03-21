/* eslint-disable import/no-extraneous-dependencies */
import { resolve, join } from 'path'

import chalk from 'chalk'
/* covered by nuxt */
import express from 'express'

import pkg from '../package.json'

import createRouter from './content/api'
import buildContent from './content/build'
import { mdParser, yamlParser } from './util/parsers'

const nuxtentConfig = rootDir => {
  const rootConfig = join(rootDir, 'nuxtent.config.js')
  try {
    return require(rootConfig)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return false
    }
    throw new Error(`[Invalid Nuxtent configuration] ${err}`)
  }
}

const debug = mess => {
  console.log(`${chalk.blue('NUXT:NUXTENT')} ${chalk.green('PROCESS')} ${mess}`)
}

const mergeContentOptions = (content, defaults) => {
  const opts = {}
  if (!Array.isArray(content)) {
    opts['/'] = { ...defaults, ...content }
  } else {
    content.forEach(entry => {
      const entryIsArray = Array.isArray(entry)
      const dirName = entryIsArray ? entry[0] : entry
      const dirOpts = entryIsArray ? entry[1] : {}
      if (dirName === '/' && content.length > 1) {
        // prevent endpoint conflict
        throw new Error(
          'Top level files not allowed with nested registered directories'
        )
      }
      opts[join('/', dirName)] = { ...defaults, ...dirOpts }
    })
  }
  return opts
}

const getAPIOptions = (originalOptions = {}, isStatic) => {
  const options =
    typeof originalOptions === 'function'
      ? originalOptions(isStatic)
      : originalOptions

  const {
    baseURL = '',
    browserBaseURL = undefined,
    otherAPIOptions = {}
  } = options

  return {
    baseURL,
    browserBaseURL: browserBaseURL || baseURL,
    ...otherAPIOptions
  }
}

const CONTENT_DIR = 'content'
const COMPONENTS_DIR = 'components'
const BUILD_DIR = 'content'
const API_SERVER_PREFIX = '/content-api'
const API_BROWSER_PREFIX = '/_nuxt/content'

export default function ContentModule(moduleOpts) {
  const userOptions =
    nuxtentConfig(this.options.rootDir) || this.options.nuxtent || {}

  const content = mergeContentOptions(userOptions.content, {
    page: null,
    permalink: ':slug',
    anchorsLevel: 1,
    isPost: true,
    generate: []
  })

  const componentsDir = join(this.options.srcDir, COMPONENTS_DIR)
  const contentDir = join(this.options.srcDir, CONTENT_DIR)
  const contentDirWebpackAlias = '~/' + CONTENT_DIR
  const port =
    process.env.PORT || process.env.npm_package_config_nuxt_port || 3000

  const isDev = this.nuxt.options.dev
  const loaderComponentExtensions = ['.vue', '.js']

  const parsers = {
    md: Object.assign(
      {},
      {
        highlight: null,
        use: []
      },
      userOptions.parsers && userOptions.parsers.md
        ? userOptions.parsers.md
        : {}
    ),
    mdParser,
    yamlParser
  }

  const routesOptions = {
    contentDir,
    content,
    parsers,
    isDev
  }

  const apiOptions = getAPIOptions(userOptions.api, process.static)

  // Add `$content` helper
  this.addPlugin({
    src: resolve(__dirname, 'plugins/requestContent.js')
  })

  // Initialize axios module
  // Try not tu use axios as it can only exist one instance
  this.requireModule([
    '@nuxtjs/axios',
    {
      ...apiOptions,
      baseURL: apiOptions.baseURL + API_SERVER_PREFIX,
      browserBaseURL:
        apiOptions.browserBaseURL +
        (!process.static ? API_SERVER_PREFIX : API_BROWSER_PREFIX)
    }
  ])

  // Add content API when running `nuxt` & `nuxt build` (development and production)
  this.addServerMiddleware({
    path: API_SERVER_PREFIX,
    handler: createRouter(
      getAPIOptions(userOptions.api, false).baseURL,
      API_SERVER_PREFIX,
      routesOptions
    )
  })

  this.nuxt.hook('build', async builder => {
    // Build dynamic content pages without components (*.md)
    debug('Sarting Build Hook')
    debug('Build dynamic content pages without components (*.md)')
    buildContent(this, BUILD_DIR, process.static, routesOptions)
  })
  let server
  // Add content API when running `nuxt generate`
  this.nuxt.hook('generate:before', async () => {
    debug('Sarting Generate Hook')
    const app = express()
    app.use(
      API_SERVER_PREFIX,
      createRouter(apiOptions.baseURL, API_SERVER_PREFIX, routesOptions)
    )
    server = app.listen(port)
  })
  this.nuxt.hook('generate:before', async () => debug('Start'))
  this.nuxt.hook('generate:done', async () => {
    debug('Ending Generate Hook')
    if (server) {
      server.close()
    }
  })

  // Generate Vue templates from markdown with components (*.comp.md)
  this.extendBuild(config => {
    config.module.rules.push({
      test: /\.comp\.md$/,
      use: [
        'vue-loader',
        {
          loader: resolve(__dirname, 'loader'),
          options: {
            componentsDir,
            extensions: loaderComponentExtensions,
            content,
            parsers
          }
        }
      ]
    })
  })

  // Add Vue templates generated from markdown with components (*.comp.md) to output build
  this.addPlugin({
    src: resolve(__dirname, 'plugins/markdownComponents.template.js'),
    options: {
      contentDirWebpackAlias
    }
  })
}

export { pkg as meta }
