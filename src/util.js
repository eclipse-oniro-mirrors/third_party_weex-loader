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

import path from 'path'
import loaderUtils from 'loader-utils'
import hash from 'hash-sum'
import {
  SourceMapGenerator,
  SourceMapConsumer
} from 'source-map'

const { DEVICE_LEVEL } = require('./lite/lite-enum')

export function getNameByPath (resourcePath) {
  return path.basename(resourcePath).replace(/\..*$/, '')
}

export function getFileNameWithHash (resourcePath, content) {
  const filename = path.relative('.', resourcePath)
  const cacheKey = hash(filename + content)
  return `./${filename}?${cacheKey}`
}

export function getFilenameByPath (filepath) {
  return path.relative('.', filepath)
}

export const FUNC_START = '#####FUN_S#####'
export const FUNC_START_REG = new RegExp('["\']' + FUNC_START, 'g')
export const FUNC_END = '#####FUN_E#####'
export const FUNC_END_REG = new RegExp(FUNC_END + '["\']', 'g')

export function stringifyFunction (key, value) {
  if (typeof value === 'function') {
    return FUNC_START + value.toString() + FUNC_END
  }
  return value
}

export function logWarn (loader, logs) {
  // add flag to determine if there is an error log
  let flag = false
  if (process.env.logLevel > 0) {
    if (logs && logs.length) {
      logs.forEach(log => {
        if (log.reason.startsWith('NOTE') && parseInt(process.env.logLevel) <= 1) {
          if (log.line && log.column) {
            loader.emitWarning('noteStartNOTE File：' + loader.resourcePath + ':' +
              log.line + ':' + log.column + '\n ' + log.reason.replace('NOTE: ', '') + 'noteEnd')
          } else {
            loader.emitWarning('noteStartNOTE File：' + loader.resourcePath +
              '\n ' + log.reason.replace('NOTE: ', '') + 'noteEnd')
          }
        } else if (log.reason.startsWith('WARN') && parseInt(process.env.logLevel) <= 2) {
          if (log.line && log.column) {
            loader.emitWarning('warnStartWARNING File：' + loader.resourcePath + ':' +
              log.line + ':' + log.column + '\n ' + log.reason.replace('WARNING: ', '') + 'warnEnd')
          } else {
            loader.emitWarning('warnStartWARNING File：' + loader.resourcePath +
              '\n ' + log.reason.replace('WARNING: ', '') + 'warnEnd')
          }
        } else if (log.reason.startsWith('ERROR') && parseInt(process.env.logLevel) <= 3) {
          flag = true
          if (log.line && log.column) {
            loader.emitError('errorStartERROR File：' + loader.resourcePath + ':' +
              log.line + ':' + log.column + '\n ' + log.reason.replace('ERROR: ', '') + 'errorEnd')
          } else {
            loader.emitError('errorStartERROR File：' + loader.resourcePath +
              '\n ' + log.reason.replace('ERROR: ', '') + 'errorEnd')
          }
        }
      })
    }
  }
  return flag
}

export function getRequireString (loaderContext, loader, filepath) {
  return 'require(' +
                loaderUtils.stringifyRequest(
                  loaderContext,
                  loader ?
                    `!!${loader}!${filepath}` :
                    `${filepath}`
                ) +
           ')\n'
}

export function stringifyLoaders (loaders) {
  return loaders.map(loader => {
    if (typeof loader === 'string') {
      return loader
    }
    else {
      const name = loader.name
      const query = []
      if (loader.query) {
        for (const k in loader.query) {
          const v = loader.query[k]
          if (v != null) {
            if (v === true) {
              query.push(k)
            }
            else if (v instanceof Array) {
              query.push(`${k}[]=${v.join(',')}`)
            }
            else {
              query.push(`${k}=${v}`)
            }
          }
        }
      }
      return `${name}${query.length ? ('?' + query.join('&')) : ''}`
    }
  }).join('!')
}

export function generateMap (loader, source, iterator) {
  const filePath = loader.resourcePath

  const fileNameWithHash = getFileNameWithHash(filePath)
  const sourceRoot = path.resolve('.')

  const map = new SourceMapGenerator({
    sourceRoot,
    skipValidation: true
  })
  map.setSourceContent(fileNameWithHash, source)

  for (const { original, generated } of iterator) {
    map.addMapping({
      source: fileNameWithHash,
      original,
      generated
    })
  }

  return map
}

export function consumeMap (loader, target, map) {
  const smc = new SourceMapConsumer(map)
  let source
  const original = []
  const generated = []
  const mapping = {}

  splitSourceLine(target)
    .forEach((input, line) => {
      const column = 0
      line = line + 1

      const pos = smc.originalPositionFor({
        line,
        column
      })

      if (pos.source) {
        source = pos.source
        original.push({
          line: pos.line,
          column: pos.column
        })
        generated.push({
          line,
          column
        })
        mapping[`line-${line}-column-${column}`] = {
          line: pos.line,
          column: pos.column
        }
      }
    })

  return {
    source,
    original,
    generated,
    mapping,
    sourcesContent: smc.sourcesContent
  }
}

const LINE_REG = /\r?\n/g
export function splitSourceLine (source) {
  return source.split(LINE_REG)
}

export function printSourceWithLine (source) {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  source = splitSourceLine(source)
    .map((input, line) => {
      console.log(line + 1 + ':', input)
    })
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
}

export function loadBabelModule (moduleName) {
  try {
    const filePath = require.resolve(moduleName)
    return filePath.slice(0, filePath.indexOf(moduleName.replace(/\//g, path.sep)) + moduleName.length)
  }
  catch (e) {
    return moduleName
  }
}

export function parseRequireModule (source) {
  const requireMethod = process.env.DEVICE_LEVEL === DEVICE_LEVEL.LITE ?
`
function requireModule(moduleName) {
  return requireNative(moduleName.slice(1));
}
` :
`
function requireModule(moduleName) {
  const systemList = ['system.router', 'system.app', 'system.prompt', 'system.configuration',
  'system.image', 'system.device', 'system.mediaquery', 'ohos.animator', 'system.grid', 'system.resource']
  var target = ''
  if (systemList.includes(moduleName.replace('@', ''))) {
    target = $app_require$('@app-module/' + moduleName.substring(1));
    return target;
  }
  var shortName = moduleName.replace(/@[^.]+\.([^.]+)/, '$1');
  if (typeof ohosplugin !== 'undefined' && /@ohos/.test(moduleName)) {
    target = ohosplugin;
    for (let key of shortName.split('.')) {
      target = target[key];
      if(!target) {
        break;
      }
    }
    if (typeof target !== 'undefined') {
      return target;
    }
  }
  if (typeof systemplugin !== 'undefined') {
    target = systemplugin;
    for (let key of shortName.split('.')) {
      target = target[key];
      if(!target) {
        break;
      }
    }
    if (typeof target !== 'undefined') {
      return target;
    }
  }
  target = requireNapi(shortName);
  return target;
}
`

  source = `${source}\n${requireMethod}`
  const requireReg = /require\(['"]([^()]+)['"]\)/g
  const libReg = /^lib(.+)\.so$/
  let requireStatements = source.match(requireReg)
  if (requireStatements && requireStatements.length) {
    for (let requireStatement of requireStatements) {
      if (requireStatement.indexOf('@system') > 0 || requireStatement.indexOf('@ohos') > 0) {
        source = source.replace(requireStatement, requireStatement.replace('require', 'requireModule'))
      }
    }
  }
  source = source.replace(requireReg, (item, item1) => {
    if (libReg.test(item1)) {
      item = `requireNapi("${item1.replace(libReg, '$1')}", true)`
    }
    return item
  })
  return source
}

export function jsonLoaders (type, customLoader) {
  let loaders = []
  switch (type) {
    case "template":
      loaders = [{
        name: path.resolve(__dirname, 'json.js')
      }, {
        name: path.resolve(__dirname, 'template.js')
      }]
      break
    case "style":
      loaders = [{
        name: path.resolve(__dirname, 'json.js')
      }, {
        name: path.resolve(__dirname, 'style.js')
      }]
      break
    case "json":
      loaders = [{
        name: path.resolve(__dirname, 'json.js')
      }]
      break
    default:
      break
  }

  if (customLoader) {
    loaders.push({
      name: path.resolve(__dirname, `../node_modules/${customLoader}`)
    })
  }
  return stringifyLoaders(loaders)
}
