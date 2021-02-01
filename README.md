## Deprecated :warning:

Nuxtent has been deprecated, please checkout Nuxt Content: https://content.nuxtjs.org

---


<p align="center">
  <img src="https://user-images.githubusercontent.com/5158436/30198986-d4c5d7f8-9485-11e7-9c3e-8b5f5f061f5f.png" />
</p>

<p align="center">

<a href="https://david-dm.org/nuxt-community/nuxtent-module">
  <img src="https://david-dm.org/nuxt-community/nuxtent-module/status.svg?style=flat-square" />
</a>

<a href="https://greenkeeper.io/">
  <img src="https://badges.greenkeeper.io/nuxt-community/nuxtent-module.svg" />
</a>

<a href="https://standardjs.com">
  <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square" />
</a>

<br />

<a href="https://circleci.com/gh/nuxt-community/nuxtent-module">
  <img src="https://img.shields.io/circleci/project/github/nuxt-community/nuxtent-module/master.svg?style=flat-square" />
</a>

<a href="https://ci.appveyor.com/project/medfreeman/nuxtent-module">
  <img src="https://img.shields.io/appveyor/ci/medfreeman/nuxtent-module/master.svg?style=flat-square&logo=appveyor" />
</a>

<a href="https://codecov.io/gh/nuxt-community/nuxtent-module">
  <img src="https://img.shields.io/codecov/c/github/nuxt-community/nuxtent-module.svg?style=flat-square" />
</a>

<br />

<a href="https://npmjs.com/package/nuxtent">
  <img src="https://img.shields.io/npm/v/nuxtent.svg?style=flat-square" />
</a>

<a href="https://npmjs.com/package/nuxtent">
  <img src="https://img.shields.io/npm/dt/nuxtent.svg?style=flat-square" />
</a>

</p>

<h1 align="center">Nuxtent</h1>

<p align="center">Seamlessly use content files in your Nuxt.js sites.</p>

<p align="center">https://nuxtent-module.netlify.com/guide</p>

[📖 Release Notes](./CHANGELOG.md)

**This is a work in progress from integrating [nuxtdown](https://github.com/joostdecock/nuxtdown-module) features and fixing critical bugs. DO NOT USE IN PRODUCTION**

# Summary

The goal of Nuxtent is to make using Nuxt for content heavy sites as easy as using Jekyll, Hugo, or any other static site generator.

Nuxtent mainly does this in two ways:

1. By compiling all the data from `markdown` or `yaml` files based on configured rules.
2. By providing helpers for dynamically accessing this data inside Nuxt pages.  
But, we didn't just want to make Nuxtent as good as a static site generator–we wanted to make it better.  
So, along with that, Nuxtent also supports:

3. The usage of content files in both static sites and dynamic applications.
4. The usage of `Vue components` inside markdown files.
5. Automatic content navigation, between pages via `path` and within pages via `anchors`.

There you go: five reasons to give `Nuxtent` a try, and maybe even star and [share]("https://twitter.com/intent/tweet) it. :smirk:

# Features

- Simple configuration
- Allows you to override settings for the markdown parser ([markdown-it](https://github.com/markdown-it/markdown-it)), and use its plugins
- Support both blog posts or similar flat content structures, and a nested hierarchy of markdown content
- Adds useful info to your markdown page's meta info, including:
	- Any data your specify in the config file
	- A breadcrumbs trail for hierarchical markdown content
	- (the info for) a table of contents
- Support for using vue components inside your markdown content
- Adds the $content helper to Nuxt to allow your to access your markdown content and metadata inside Nuxt pages

# v3.X goals

- [ ] Improve the documentation and at least a spanish translation
- [-] Windows compatible (Help needed)
- [ ] Be zeroconf and extendible through it's own api and exposing the markdown parser
- [ ] Allow default attributes to be set on the frontmatter ej. title
- [ ] Real async modules (this affects ssr more than a static build)
- [ ] Fully integrate with the new features nuxt2.0 and node 11
- [ ] Debugable configuration
- [ ] Better error reporting
- [ ] Improve the template with optional addons as examples
- [ ] Document the code in order to simplify contributions and future development
- [ ] Support multiple file types
- [ ] Integrate the api configuration with nuxt itself while keeping it configurable
- [x] Expose $content helper and it's constant like api endpoint through all of vue
- [ ] Vuex integration
- [-] Improve on SSR memory usage
- [ ] Keep the main features from nuxtdown:
  - [ ] Breadcrubms
  - [ ] Automatic table of content (TOC)
  - [ ] Isolated and global configurations
  - [ ] Allow for nested content and index files


## Simple yet flexible API

Nuxtent was created to integrate with Nuxt (otherwise, you're just building another Jekyll-like tool, with the same amount of mental overhead).

Nuxtent's API is simple yet flexible. All you have to do is 

- Configure the content and
- Fetch the files with the `$content` helper inside the `asyncData` method that is available in Nuxt pages.


Here's a basic example:

```js
// nuxtent.config.js
module.exports = {
  content: {
    page: '/_post',
    permalink: ':year/:slug'
  }
}

```

```js
// pages/_post.vue
export default {
  asyncData: async ({ app, route }) => ({
    post: await app.$content('posts').get(route.path)
  })
}
```

The response for each item is:

``` json

{
	
}
```


## Quick Start

If you're starting a new site, you can use the [nuxtent-starter](https://github.com/nuxt-community/content-template) template.

``` bash
$ vue init nuxt-community/nuxtent-template my-site
$ cd my-site
# install dependencies
$ npm install # Or yarn install
```


Or if you already have your nuxt project:




## Installation

```
npm install nuxtent --save

```

Then, under `nuxt.config.js` install the module:

```
modules: [
   'nuxtent'
 ]
```

## Documentation

Documentation available at: https://nuxtent-module.netlify.com/guide (built with Nuxtent).

## Sites built with Nuxtent

*Have a site using Nuxtent? Fork the repo and add it to the list below!*

### Personal Sites
- [alidcastano.com](https://alidcastano.com/) [source](https://github.com/alidcastano/alidcastano)
- [patternworks.com.au](https://patternworks.com.au/) [source](https://github.com/callumflack/patternworks-2018)
- [askcreative.space](https://askcreative.space) [source](https://github.com/askcreative/asksite)
- [mat.services](https://mat.services) [source](https://gitlab.com/matthewess/mat.services)

### Documentation Sites
- [ency.now.sh](https://ency.now.sh/) [source](https://github.com/encyjs/docs)


### Corporate Sites
- [dinamo.mx](https://dinamo.mx)
- [yagodemarta.com](https://yagodemarta.com)
- []


## License

[MIT License](./LICENSE)

Copyright (c) 2017 Nuxt Community
