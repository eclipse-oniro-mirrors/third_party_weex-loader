/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import loaderUtils from 'loader-utils'
import path from 'path'
import fs from 'fs'

import * as legacy from './legacy'
import {
  parseFragment
}
from './parser'
import {
  getNameByPath,
  getRequireString,
  stringifyLoaders,
  logWarn,
  loadBabelModule,
  elements
}
from './util'
import { isReservedTag } from './templater/component_validator'

const { DEVICE_LEVEL } = require('./lite/lite-enum')
const loaderPath = __dirname
const defaultLoaders = {
  none: '',
  main: path.resolve(loaderPath, 'loader.js'),
  template: path.resolve(loaderPath, 'template.js'),
  style: path.resolve(loaderPath, 'style.js'),
  script: path.resolve(loaderPath, 'script.js'),
  json: path.resolve(loaderPath, 'json.js'),
  babel: loadBabelModule('babel-loader'),
  manifest: path.resolve(loaderPath, 'manifest-loader.js'),
  resourceReferenceScript: path.resolve(loaderPath, 'resource-reference-script.js')
}

/**
 * Central loader configuration factory that returns the appropriate loader string
 * based on file type and configuration. Acts as a dispatcher for specialized loader strings.
 * 
 * @param {string} type - The type of loader needed (main/element/template/style/script/config/data)
 * @param {Object} config - Configuration options for the loader including:
 *                - lang: Language specification
 *                - customLang: Custom language loaders
 *                - source: Source file path
 *                - app: Boolean flag for application scripts
 * @returns {string} Webpack-compatible loader string
 */
function getLoaderString (type, config) {
  config = config || {}
  const customLoader = loadCustomLoader(config)
  let loaders
  switch (type) {
    case 'main':
      return mainLoaderString(loaders)
    case 'element':
      return elementLoaderString(loaders, config)
    case 'template':
      return templateLoaderString(loaders, config, customLoader)
    case 'style':
      return styleLoaderString(loaders, config, customLoader)
    case 'script':
      return scriptLoaderString(loaders, config, customLoader)
    case 'config':
      return configLoaderString(loaders, config)
    case 'data':
      return dataLoaderString(loaders, config)
  }
}

/**
 * Loads a custom language loader based on configuration
 * Primarily used for loading Babel-compatible language processors (like TypeScript, Flow, etc.)
 * 
 * @param {Object} config - Configuration object containing:
 *                - lang: The language to load (e.g., 'typescript', 'flow')
 *                - customLang: Map of available custom languages and their loaders
 * @returns {Function|undefined} The loaded custom loader function, or undefined if not found
 */
function loadCustomLoader (config) {
  if (config.lang && config.customLang[config.lang]) {
    return loadBabelModule(config.customLang[config.lang][0])
  }
}

/**
 * Generates a webpack loader string using the default main loader
 * Provides a clean way to get the standard main loader configuration
 * 
 * @param {Array} loaders - Initial loader array (will be overridden)
 * @returns {string} Webpack-compatible loader string with just the main loader
 */
function mainLoaderString (loaders) {
  loaders = [{
    name: defaultLoaders.main
  }]
  return stringifyLoaders(loaders)
}

/**
 * Generates a webpack loader string for processing custom elements/components
 * Configures the main loader with element-specific options
 * 
 * @param {Array} loaders - Initial loader array (will be overridden)
 * @param {Object} config - Configuration options including:
 *                - source: Source file path (optional)
 * @returns {string} Webpack-compatible loader string
 */
function elementLoaderString (loaders, config) {
  loaders = [{
    name: defaultLoaders.main,
    query: {
      element: config.source ? undefined : true
    }
  }]
  return stringifyLoaders(loaders)
}

/**
 * Generates a webpack loader string for processing template files
 * Combines default JSON parsing with template processing, plus optional custom loaders
 * 
 * @param {Array} loaders - Initial loader array (will be overridden)
 * @param {Object} config - Configuration options (currently unused)
 * @param {Array} customLoader - Optional custom loaders to append
 * @returns {string} Webpack-compatible loader string
 */
function templateLoaderString (loaders, config, customLoader) {
  loaders = [{
    name: defaultLoaders.json
  }, {
    name: defaultLoaders.template
  }]
  if (customLoader) {
    loaders = loaders.concat(customLoader)
  }
  return stringifyLoaders(loaders)
}

/**
 * Generates a webpack loader string for processing style files (CSS/LESS/SASS/etc)
 * Combines default JSON and style loaders with optional custom loaders
 * 
 * @param {Array} loaders - Initial loader configuration (will be overridden)
 * @param {Object} config - Configuration options (unused in current implementation)
 * @param {Array} customLoader - Optional array of custom loaders to append
 * @returns {string} Webpack-compatible loader string
 */
function styleLoaderString (loaders, config, customLoader) {
  loaders = [{
    name: defaultLoaders.json
  }, {
    name: defaultLoaders.style
  }]
  if (customLoader) {
    loaders = loaders.concat(customLoader)
  }
  return stringifyLoaders(loaders)
}

/**
 * Generates a webpack loader string for JavaScript/script files with configurable options
 * Supports custom loaders, Babel transpilation, and manifest processing for apps
 * 
 * @param {Array} loaders - Initial loader configuration (will be overridden)
 * @param {Object} config - Configuration options including:
 *                - app: boolean indicating if processing app script
 *                - source: source file path
 * @param {Array} customLoader - Optional custom loaders to include
 * @returns {string} Webpack-compatible loader string
 */
function scriptLoaderString (loaders, config, customLoader) {
  loaders = [{
    name: defaultLoaders.script
  }]
  if (customLoader) {
    loaders = loaders.concat(customLoader)
  }
  else {
    const isTargets = {
      'extends': path.resolve(__dirname, "../babel.config.js")
    }
    if (process.env.DEVICE_LEVEL === DEVICE_LEVEL.RICH) {
      isTargets['targets'] = 'node 8';
    }
    loaders.push({
      name: defaultLoaders.babel,
      query: isTargets,
    })
    loaders.push({
      name: defaultLoaders.resourceReferenceScript
    })
  }
  if (config.app && process.env.abilityType === 'page' &&
    fs.existsSync(process.env.aceManifestPath)) {
    loaders.push({
      name: defaultLoaders.manifest,
      query: {
        path: config.source
      }
    })
  }
  return stringifyLoaders(loaders)
}

/**
 * Generates a webpack loader string specifically for configuration files (e.g., JSON configs)
 * Defaults to using the standard JSON loader regardless of input
 * 
 * @param {Array} loaders - Original loader array (gets overridden)
 * @param {Object} config - Additional configuration options (currently unused)
 * @returns {string} Webpack-compatible loader string
 */
function configLoaderString (loaders, config) {
  loaders = [{
    name: defaultLoaders.json
  }]
  return stringifyLoaders(loaders)
}

/**
 * Generates a loader string for processing data files (e.g., JSON)
 * Uses default JSON loader configuration and stringifies the loader chain
 * 
 * @param {Array} loaders - Original loader configuration (overridden in this function)
 * @param {Object} config - Additional configuration object (unused in current implementation)
 * @returns {string} Stringified loader configuration
 */
function dataLoaderString (loaders, config) {
  loaders = [{
    name: defaultLoaders.json
  }]
  return stringifyLoaders(loaders)
}

/**
 * Webpack loader function that processes application and page components
 * Handles both entry files and child components with proper dependency tracking
 * 
 * @param {string} source - The source code of the file being processed
 * @returns {string} The processed output code
 */
function loader (source) {
  this.cacheable && this.cacheable()

  const options = {
    lang: {
      sass:['sass-loader'],
      scss:['sass-loader'],
      less:['less-loader']
    }
  }
  const customLang = options.lang || {}
  const resourceQuery = this.resourceQuery && loaderUtils.parseQuery(this.resourceQuery) || {}
  const isEntry = resourceQuery.entry
  const dirName = path.parse(this.resourcePath)
  const name = isEntry ? dirName.name : resourceQuery.name || getNameByPath(this.resourcePath)
  let parentPath = resourceQuery.parentPath || this.resourcePath;
  if (isEntry) {
    elements[this.resourcePath] = elements[this.resourcePath] || {};
    elements[this.resourcePath][name] = true;
  } else {
    elements[this.resourcePath] = elements[this.resourcePath] || {};
    elements[this.resourcePath]["parent"] = parentPath;
    if (elements[parentPath] && elements[parentPath]["parent"]) {
      elements[this.resourcePath]["parent"] = elements[elements[parentPath]["parent"]];
      parentPath = elements[this.resourcePath]["parent"];
    }
  }
  if (isReservedTag(name) && process.env.abilityType === 'page') {
    logWarn(this, [{
      reason: 'ERROR: The file name cannot contain reserved tag name: ' + name
    }])
    return ''
  }
  let output = ''
  //  import app.js
  output += loadApp(this, name, isEntry, customLang, source)
  output += loadPage(this, name, isEntry, customLang, source, parentPath);
  return output
}

/**
 * Determines if the current resource is the main application file
 * 
 * @param {Object} _this - Webpack loader context
 * @returns {boolean} True if the file is the main application file, false otherwise
 */
function checkApp(_this) {
  if (process.env.abilityType === 'testrunner') {
    return true;
  }
  return _this.resourcePath === path.resolve(process.env.projectPath,
    process.env.abilityType === 'page' ? 'app.js' : `${process.env.abilityType}.js`)
}

/**
 * Loads and processes an application entry file (app.js)
 * Handles both Rich and Lite device levels, including CSS and script loading
 * 
 * @param {Object} _this - Webpack loader context
 * @param {string} name - Application name
 * @param {boolean} isEntry - Whether this is an entry point
 * @param {string} customLang - Custom language setting
 * @param {string} source - Source content of the file
 * @returns {string} Generated output code for the application
 */
function loadApp (_this, name, isEntry, customLang, source) {
  let output = ''
  let extcss = false
  if (checkApp(_this)) {
    const filename = _this.resourcePath.replace(path.extname(_this.resourcePath).toString(), '')
     // find css
    const cssFileName = filename + '.css'
    if (!fs.existsSync(cssFileName)) {
      extcss = false
    }
    else {
      extcss = true
      output += 'var $app_style$ = ' + getRequireString(_this, getLoaderString('style', {
        customLang,
        lang: undefined,
        element: undefined,
        elementName: undefined,
        source: cssFileName
      }), cssFileName)
    }
    output += 'var $app_script$ = ' + getRequireString(_this, getLoaderString('script', {
      customLang,
      lang: undefined,
      element: undefined,
      elementName: undefined,
      source: _this.resourcePath,
      app: true
    }), _this.resourcePath)

    if (process.env.DEVICE_LEVEL === DEVICE_LEVEL.RICH || process.env.DEVICE_LEVEL === 'card') {
      output += `
      $app_define$('@app-application/${name}', [], function($app_require$, $app_exports$, $app_module$) {
      ` + `
      $app_script$($app_module$, $app_exports$, $app_require$)
      if ($app_exports$.__esModule && $app_exports$.default) {
        $app_module$.exports = $app_exports$.default
      }
      ` + (extcss ? `
      $app_module$.exports.style = $app_style$
      ` : '')
      + `
      })
      `
      if (isEntry) {
        output += `$app_bootstrap$('@app-application/${name}'` + ',undefined' + ',undefined' + `)`
      }
    }
    if (process.env.DEVICE_LEVEL === DEVICE_LEVEL.LITE) {
      output += `var options=$app_script$\n if ($app_script$.__esModule) {\n
        options = $app_script$.default;\n }\n` +
      (extcss ? `options.styleSheet=$app_style$\n` : ``) +
      `module.exports=new ViewModel(options);`
    }
    return output
  } else if (/\.js$/.test(_this.resourcePath)) {
    return source
  } else {
    return output
  }
}

/**
 * Main function for loading and processing a page/component
 * Coordinates the loading of all associated resources (template, CSS, JS)
 * and generates the final output code for either Rich or Lite device level
 * 
 * @param {Object} _this - Webpack loader context
 * @param {string} name - Name of the component/page
 * @param {boolean} isEntry - Whether this is an entry point
 * @param {string} customLang - Custom language setting
 * @param {string} source - Source content of the file
 * @param {string} parentPath - Path of the parent component
 * @returns {string} Generated output code for the component
 */
function loadPage (_this, name, isEntry, customLang, source, parentPath) {
  let output = ''
  if (path.extname(_this.resourcePath).match(/\.hml/)) {
    const filename = _this.resourcePath.replace(path.extname(_this.resourcePath).toString(), '')
    const resourcePath = _this.resourcePath
    const loaderQuery = loaderUtils.getOptions(_this) || {}
    const isElement = loaderQuery.element
    const frag = parseFragment(source)
    const elementNames = []
    const elementLength = frag.element.length
    output += loadPageCheckElementLength(_this, elementLength, frag, elementNames, resourcePath,
      customLang, parentPath);

    output += 'var $app_template$ = ' + getRequireString(_this, getLoaderString('template', {
      customLang,
      lang: undefined,
      element: isElement,
      elementName: isElement ? name : undefined,
      source: _this.resourcePath
    }), _this.resourcePath)

    // find css
    const cssContent = loadPageFindCss(_this, filename, customLang)
    const extcss = cssContent.extcss
    output += cssContent.output

    // find js
    const scriptContent = loadPageFindJs(_this, filename, customLang)
    const extscript = scriptContent.extscript
    output += scriptContent.output

    output += process.env.DEVICE_LEVEL === DEVICE_LEVEL.RICH ? loadPageCheckRich(name, extscript, extcss, isEntry) :
      loadPageCheckLite(extscript, extcss)
    return output
  }
  return output
}

/**
 * Processes custom elements in a template and generates corresponding require statements
 * Validates element configurations and checks for naming conflicts
 * 
 * @param {Object} _this - Webpack compilation context
 * @param {number} elementLength - Number of custom elements to process
 * @param {Object} frag - Fragment containing element definitions
 * @param {Array} elementNames - Array to collect processed element names
 * @param {string} resourcePath - Path of the parent resource
 * @param {string} customLang - Custom language setting for loaders
 * @param {string} parentPath - Path of the parent component
 * @returns {string} Generated require statements for all valid elements
 */
function loadPageCheckElementLength (_this, elementLength, frag, elementNames, resourcePath,
  customLang, parentPath) {
  let output = ''
  if (elementLength) {
    for (let i = 0; i < elementLength; i++) {
      const element = frag.element[i]
      let src = resourcePath
      if (element.src) {
        src = element.src
        if (!src.match(/\.hml$/)) {
          src = src.concat('.hml')
        }
        const filePath = path.join(path.dirname(resourcePath), src)
        if (!fs.existsSync(filePath) && src.match(/^(\/|\.)/)) {
          logWarn(_this, [{
            reason: 'ERROR: The file path of custom element does not exist, src: ' + src
          }])
          return ''
        }
        if (!element.name) {
          element.name = path.parse(src).name
        }
        element.name = element.name.toLowerCase();
        elements[parentPath] = elements[parentPath] || {};
        if (elements[parentPath][element.name]) {
          logWarn(_this, [{
            reason: `ERROR: The element name can not be same with the page ` +
              `"${element.name}" (ignore case).`
          }]);
        } else {
          elements[parentPath][element.name] = true;
        }
        checkEntry(_this, filePath, element.src)
      }
      else {
        logWarn(_this, [{
          reason: 'ERROR: src attributes must be set for custom elements.'
        }])
        return ''
      }
      elementNames.push(element.name)
      output += getRequireString(_this, getLoaderString('element', {
        customLang,
        name: element.name,
        source: src
      }), `${src}?name=${element.name}&parentPath=${parentPath}`)
    }
  }
  return output
}

/**
 * Checks for and loads CSS or preprocessor style files associated with a component/page
 * Supports CSS, LESS, SCSS, and SASS file formats
 * Generates the require statement for the style file if found
 * 
 * @param {Object} _this - Webpack compilation context
 * @param {string} filename - Base filename (without extension)
 * @param {string} customLang - Custom language setting for the loader
 * @returns {Object} Returns an object containing:
 *   - extcss: boolean indicating if any style file exists
 *   - output: generated require statement or empty string
 */
function loadPageFindCss (_this, filename, customLang) {
  let output = ''
  let extcss = false
  const cssFileName = filename + '.css'
  if (fs.existsSync(cssFileName)) {
    extcss = true
    output = 'var $app_style$ = ' + getRequireString(_this, getLoaderString('style', {
      customLang,
      lang: undefined,
      element: undefined,
      elementName: undefined,
      source: cssFileName
    }), cssFileName)
  }
  else {
    // find less
    const lessFileName = filename + '.less'
    if (fs.existsSync(lessFileName)) {
      extcss = true
      output = 'var $app_style$ = ' + getRequireString(_this, getLoaderString('style', {
        customLang,
        lang: 'less',
        element: undefined,
        elementName: undefined,
        source: lessFileName
      }), lessFileName)
    }
    else {
      // find scss
      const scssFileName = filename + '.scss'
      if (fs.existsSync(scssFileName)) {
        extcss = true
        output = 'var $app_style$ = ' + getRequireString(_this, getLoaderString('style', {
          customLang,
          lang: 'scss',
          element: undefined,
          elementName: undefined,
          source: scssFileName
        }), scssFileName)
      }
      else {
        // find sass
        const sassFileName = filename + '.sass'
        if (fs.existsSync(sassFileName)) {
          extcss = true
          output = 'var $app_style$ = ' + getRequireString(_this, getLoaderString('style', {
            customLang,
            lang: 'sass',
            element: undefined,
            elementName: undefined,
            source: sassFileName
          }), sassFileName)
        }
        else {
          extcss = false
        }
      }
    }
  }
  return {
    extcss: extcss,
    output: output
  }
}

/**
 * Checks for and loads a JavaScript file associated with a component/page
 * Generates the require statement for the JS file if it exists
 * 
 * @param {Object} _this - Webpack compilation context
 * @param {string} filename - Base filename (without extension) 
 * @param {string} customLang - Custom language setting for the loader
 * @returns {Object} Returns an object containing:
 *   - extscript: boolean indicating if JS file exists
 *   - output: generated require statement or empty string
 */
function loadPageFindJs (_this, filename, customLang) {
  let output = ''
  let extscript = false
  const jsFileName = filename + '.js'
  if (!fs.existsSync(jsFileName)) {
    extscript = false
    console.log('missing ' + jsFileName)
  }
  else {
    extscript = true
    output = 'var $app_script$ = ' + getRequireString(_this, getLoaderString('script', {
      customLang,
      lang: undefined,
      element: undefined,
      elementName: undefined,
      source: jsFileName
    }), jsFileName)
  }
  return {
    extscript: extscript,
    output: output
  }
}

/**
 * Generates component initialization code for Rich mode
 * Creates a component definition with optional script and style, and handles entry point bootstrapping
 * 
 * @param {string} name - Component name
 * @param {boolean} extscript - Whether the component has an external script
 * @param {boolean} extcss - Whether the component has external CSS 
 * @param {boolean} isEntry - Whether this is an entry component
 * @returns {string} Generated component definition and bootstrap code
 */
function loadPageCheckRich (name, extscript, extcss, isEntry) {
  let output = ''
  output += `
$app_define$('@app-component/${name}', [], function($app_require$, $app_exports$, $app_module$) {
` + (extscript ? `
$app_script$($app_module$, $app_exports$, $app_require$)
if ($app_exports$.__esModule && $app_exports$.default) {
$app_module$.exports = $app_exports$.default
}
` : '') + `
$app_module$.exports.template = $app_template$
` + (extcss ? `
$app_module$.exports.style = $app_style$
` : '') + `
})
`
  if (isEntry) {
    output += `$app_bootstrap$('@app-component/${name}'` + ',undefined' + ',undefined' + `)`
  }
  return output
}

/**
 * Generates the page initialization code for Lite mode
 * Combines script, style, and template components into a ViewModel instance
 * 
 * @param {boolean} extscript - Whether external script exists
 * @param {boolean} extcss - Whether external CSS exists
 * @returns {string} Generated initialization code
 */
function loadPageCheckLite (extscript, extcss) {
  return (extscript ? `var options=$app_script$\n if ($app_script$.__esModule) {\n
      options = $app_script$.default;\n }\n` : `var options={}\n`) +
    (extcss ? `options.styleSheet=$app_style$\n` : ``) +
    `options.render=$app_template$;\nmodule.exports=new ViewModel(options);`
}

for (const key in legacy) {
  loader[key] = legacy[key]
}

/**
 * Checks if the given file path is an entry file and issues a warning if true
 * 
 * @param {Object} _this - Webpack compilation context object containing build information
 * @param {string} filePath - Absolute file path to check
 * @param {string} elementSrc - Page path from config file, used for warning message
 */
function checkEntry(_this, filePath, elementSrc) {
  if (_this._compilation.entries) {
    for (var key of _this._compilation.entries.keys()) {
      const entryPath = path.join(path.resolve(process.env.projectPath), key + '.hml');
      if (entryPath === filePath) {
        logWarn(_this, [{
          reason: `WARNING: The page "${elementSrc}" configured in 'config.json'` +
            ` can not be uesd as a custom component.` +
            `To ensure that the debugging function is normal, please delete this page in 'config.json'.`
        }]);
      }
    }
  }
}

module.exports = loader