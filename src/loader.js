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

function loadCustomLoader (config) {
  if (config.lang && config.customLang[config.lang]) {
    return loadBabelModule(config.customLang[config.lang][0])
  }
}

function mainLoaderString (loaders) {
  loaders = [{
    name: defaultLoaders.main
  }]
  return stringifyLoaders(loaders)
}

function elementLoaderString (loaders, config) {
  loaders = [{
    name: defaultLoaders.main,
    query: {
      element: config.source ? undefined : true
    }
  }]
  return stringifyLoaders(loaders)
}

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

function scriptLoaderString (loaders, config, customLoader) {
  loaders = [{
    name: defaultLoaders.script
  }]
  if (customLoader) {
    loaders = loaders.concat(customLoader)
  }
  else {
    const isTargets = {
      presets: [loadBabelModule('@babel/preset-env')],
      plugins: [loadBabelModule('@babel/plugin-transform-modules-commonjs')],
      comments: 'false'
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

function configLoaderString (loaders, config) {
  loaders = [{
    name: defaultLoaders.json
  }]
  return stringifyLoaders(loaders)
}

function dataLoaderString (loaders, config) {
  loaders = [{
    name: defaultLoaders.json
  }]
  return stringifyLoaders(loaders)
}

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

function checkApp(_this) {
  if (process.env.abilityType === 'testrunner') {
    return true;
  }
  return _this.resourcePath === path.resolve(process.env.projectPath,
    process.env.abilityType === 'page' ? 'app.js' : `${process.env.abilityType}.js`)
}

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

function loadPageCheckLite (extscript, extcss) {
  return (extscript ? `var options=$app_script$\n if ($app_script$.__esModule) {\n
      options = $app_script$.default;\n }\n` : `var options={}\n`) +
    (extcss ? `options.styleSheet=$app_style$\n` : ``) +
    `options.render=$app_template$;\nmodule.exports=new ViewModel(options);`
}

for (const key in legacy) {
  loader[key] = legacy[key]
}

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