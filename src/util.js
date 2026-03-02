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
import fs from 'fs'
import loaderUtils from 'loader-utils'
const crypto = require("crypto")
const JSON5 = require('json5');
import {
  SourceMapGenerator,
  SourceMapConsumer
} from 'source-map'

const { systemModules } =  require('../main.product')
const { DEVICE_LEVEL } = require('./lite/lite-enum')
export const useOSFiles = new Set();
export const elements = {};

/**
 * Get name by path (basename without extension)
 * @param {string} resourcePath
 * @returns {string}
 */
export function getNameByPath (resourcePath) {
  return path.basename(resourcePath).replace(/\..*$/, '')
}

/**
 * Generate a file name with a hash to cache-bust
 * Uses sha256 over the relative path and content
 * @param {string} resourcePath
 * @param {any} content
 * @returns {string} hashed file name reference
 */
export function getFileNameWithHash (resourcePath, content) {
  const filename = path.relative('.', resourcePath)
  const hash = crypto.createHash('sha256')
  hash.update((filename + content).toString())
  const cacheKey = hash.digest('hex')
  return `./${filename}?${cacheKey}`
}

/**
 * Get relative filename from a path
 * @param {string} filepath
 * @returns {string}
 */
export function getFilenameByPath (filepath) {
  return path.relative('.', filepath)
}

export const FUNC_START = '#####FUN_S#####'
export const FUNC_START_REG = new RegExp('["\']' + FUNC_START, 'g')
export const FUNC_END = '#####FUN_E#####'
export const FUNC_END_REG = new RegExp(FUNC_END + '["\']', 'g')

/**
 * Custom replacer for JSON.stringify to serialize functions
 * Functions are wrapped with unique markers for later restoration
 * @param {string} key
 * @param {*} value
 * @returns {*}
 */
export function stringifyFunction (key, value) {
  if (typeof value === 'function') {
    return FUNC_START + value.toString() + FUNC_END
  }
  return value
}

/**
 * Emit warnings and errors to webpack loader based on logs
 * @param {Object} loader
 * @param {Array} logs
 * @returns {boolean} whether an error was encountered
 */
export function logWarn (loader, logs) {
  // add flag to determine if there is an error log
  let flag = false
  if (process.env.logLevel > 0) {
    if (logs && logs.length) {
      logs.forEach(log => {
        if (log.reason.startsWith('NOTE') && parseInt(process.env.logLevel) <= 1) {
          if (log.line && log.column) {
            loader.emitWarning('noteStartNOTE File:' + loader.resourcePath + ':' +
              log.line + ':' + log.column + '\n ' + log.reason.replace('NOTE: ', '') + 'noteEnd')
          } else {
            loader.emitWarning('noteStartNOTE File:' + loader.resourcePath +
              '\n ' + log.reason.replace('NOTE: ', '') + 'noteEnd')
          }
        } else if (log.reason.startsWith('WARN') && parseInt(process.env.logLevel) <= 2) {
          if (log.line && log.column) {
            loader.emitWarning('warnStartWARNING File:' + loader.resourcePath + ':' +
              log.line + ':' + log.column + '\n ' + log.reason.replace('WARNING: ', '') + 'warnEnd')
          } else {
            loader.emitWarning('warnStartWARNING File:' + loader.resourcePath +
              '\n ' + log.reason.replace('WARNING: ', '') + 'warnEnd')
          }
        } else if (log.reason.startsWith('ERROR') && parseInt(process.env.logLevel) <= 3) {
          flag = true
          if (log.line && log.column) {
            loader.emitError('errorStartERROR File:' + loader.resourcePath + ':' +
              log.line + ':' + log.column + '\n ' + log.reason.replace('ERROR: ', '') + 'errorEnd')
          } else {
            loader.emitError('errorStartERROR File:' + loader.resourcePath +
              '\n ' + log.reason.replace('ERROR: ', '') + 'errorEnd')
          }
        }
      })
    }
  }
  return flag
}

/**
 * Build a require string for a given filepath with optional loader
 * @param {Object} loaderContext
 * @param {string} loader
 * @param {string} filepath
 * @returns {string}
 */
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

/**
 * Convert an array of loader specs to a string representation
 * @param {Array} loaders
 * @returns {string}
 */
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

/**
 * Create a SourceMapGenerator for given source and mappings
 * @param {Object} loader
 * @param {string} source
 * @param {Iterable} iterator
 * @returns {SourceMapGenerator}
 */
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

/**
 * Consume and map a generated source map to original positions
 * @param {Object} loader
 * @param {string} target
 * @param {Object} map
 * @returns {Object}
 */
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
/**
 * Split source into lines (preserving newline handling)
 * @param {string} source
 * @returns {Array<string>}
 */
export function splitSourceLine (source) {
  return source.split(LINE_REG)
}

/**
 * Print source with line numbers to console (debug helper)
 * @param {string} source
 */
export function printSourceWithLine (source) {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  source = splitSourceLine(source)
    .map((input, line) => {
      console.log(line + 1 + ':', input)
    })
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
}

/**
 * Resolve a babel module path or fall back to module name
 * @param {string} moduleName
 * @returns {string}
 */
export function loadBabelModule (moduleName) {
  try {
    const filePath = require.resolve(moduleName)
    return filePath.slice(0, filePath.indexOf(moduleName.replace(/\//g, path.sep)) + moduleName.length)
  }
  catch (e) {
    return moduleName
  }
}

const methodForLite =
`
function requireModule(moduleName) {
  return requireNative(moduleName.slice(1));
}
`
const methodForOthers =
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
  target = requireNapi(shortName);
  if (typeof target !== 'undefined' && /@ohos/.test(moduleName)) {
    return target;
  }
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
  return target;
}
`
/**
 * Parse and rewrite require statements for module resolution
 * @param {string} source
 * @param {string} resourcePath
 * @returns {string}
 */
export function parseRequireModule (source, resourcePath) {
  const requireMethod = process.env.DEVICE_LEVEL === DEVICE_LEVEL.LITE ? methodForLite : methodForOthers
  source = `${source}\n${requireMethod}`
  const requireReg = /require\(['"]([^()]+)['"]\)/g
  const libReg = /^lib(.+)\.so$/
  const REG_SYSTEM = /@(system|ohos|hms)\.(\S+)/g;
  let requireStatements = source.match(requireReg)
  if (requireStatements && requireStatements.length) {
    for (let requireStatement of requireStatements) {
      const requireStatementExec = /\((\"|\')(.+)(\"|\')\)/.exec(requireStatement);
      checkModuleIsVaild(requireStatementExec, resourcePath);
      if (requireStatement.match(REG_SYSTEM) && requireStatementExec && requireStatementExec.length > 3) {
        if (systemModules.length === 0 || systemModules.includes(requireStatementExec[2] + '.d.ts') ||
          process.env.DEVICE_LEVEL === 'lite') {
          source = source.replace(requireStatement, requireStatement.replace('require', 'requireModule'));
        }
      }
    }
  }
  source = source.replace(requireReg, (item, item1) => {
    if (libReg.test(item1)) {
      item = `requireNapi("${item1.replace(libReg, '$1')}", true)`
      if (resourcePath) {
        useOSFiles.add(resourcePath);
      }
    }
    return item
  })
  return source
}

/**
 * Build loader string for json/template/style files
 * @param {string} type
 * @param {string} customLoader
 * @param {boolean} isVisual
 * @param {any} queryType
 * @returns {string}
 */
export function jsonLoaders (type, customLoader, isVisual, queryType) {
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

  if (isVisual) {
    loaders.push({
      name: path.resolve(__dirname, 'extgen.js'),
      query: {
        type: queryType
      }
    })
  }

  return stringifyLoaders(loaders)
}

/**
 * Recursively copy directory contents from inputPath to outputPath
 * @param {string} inputPath
 * @param {string} outputPath
 */
export function circularFile(inputPath, outputPath) {
  if ((!inputPath) || (!outputPath)) {
    return;
  }
  fs.readdir(inputPath,function(err, files){
    if (!files) {
      return;
    }
    files.forEach(file => {
      const inputFile = path.resolve(inputPath, file);
      const outputFile = path.resolve(outputPath, file);
      const fileStat = fs.statSync(inputFile);
      if (fileStat.isFile()) {
        copyFile(inputFile, outputFile);
      } else {
        circularFile(inputFile, outputFile);
      }
    });
  })
}

/**
 * Copy a single file, creating parent directories if needed
 * @param {string} inputFile
 * @param {string} outputFile
 */
function copyFile(inputFile, outputFile) {
  try {
    const parent = path.join(outputFile, '..');
    if (!(fs.existsSync(parent) && fs.statSync(parent).isDirectory())) {
      mkDir(parent);
    }
    if (path.parse(parent).name === 'i18n' && path.parse(inputFile).ext === '.json' &&
      fs.existsSync(outputFile)) {
        copyJsonFile(inputFile, outputFile);
    } else if (!fs.existsSync(outputFile)){
      fs.writeFileSync(outputFile, fs.readFileSync(inputFile));
    }
  } catch (err) {
    throw err;
  }
}

/**
 * Check if fullPath is under basePath (case-insensitive, normalized)
 * @param {string} fullPath
 * @param {string} basePath
 * @returns {boolean}
 */
function isPathUnderBase(fullPath, basePath) {
  const normalizedFullPath = fullPath.replace(/\\/g, '/').toLowerCase();
  const normalizedBasePath = basePath.replace(/\\/g, '/').toLowerCase() + '/';

  return normalizedFullPath.startsWith(normalizedBasePath);
}

/**
 * Validate required module for lite/device level
 * @param {Array|undefined} requireStatementExec
 * @param {string} resourcePath
 */
function checkModuleIsVaild(requireStatementExec, resourcePath) {
  if (process.env.DEVICE_LEVEL  !== 'lite' || !requireStatementExec || requireStatementExec.length <= 3) {
    return;
  }

  const appJSPath = path.dirname(path.resolve(process.env.projectPath, 'app.js'));
  if (!isPathUnderBase(resourcePath, appJSPath)) {
    return;
  }

  const json5Path = path.join(process.env.projectPath, '../../../../', 'oh-package.json5');
  const dependencies = [];
  if (fs.existsSync(json5Path)) {
    const json5Content = fs.readFileSync(json5Path, 'utf8');
    const content = JSON5.parse(json5Content);
    if (content.dependencies) {
      Object.keys(content.dependencies).forEach(element =>{
        dependencies.push(element);
      });
    }
  }

  if (dependencies.length === 0) {
    return;
  }

  const moduleName = requireStatementExec[2];
  if (moduleName.includes('../')) {
    return;
  }
  if (!dependencies.includes(moduleName)) {
    throw new Error(`Cannot find module ${moduleName} or its corresponding type declarations.`);
  }
}

/**
 * Copy and merge JSON files, preserving existing keys
 * @param {string} inputFile
 * @param {string} outputFile
 */
function copyJsonFile(inputFile, outputFile) {
  try {
    const contentInput = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
    const contentOutput = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
    Object.keys(contentInput).forEach(function (key) {
      const contentElementMerge = mergeJson(contentInput[key], contentOutput[key]);
      contentOutput[key] = contentElementMerge;
    });
    fs.writeFileSync(outputFile, JSON.stringify(contentOutput, null, '\t'));
  } catch (err) {
    throw err;
  }
}

/**
 * Recursively merge JSON objects (inputValue overwrites outputValue where applicable)
 * @param {any} inputValue
 * @param {any} outputValue
 * @returns {any}
 */
function mergeJson(inputValue, outputValue) {
  if (outputValue === null || outputValue === undefined) {
    return inputValue;
  }
  const typeInput = typeof inputValue;
  if (typeInput === typeof outputValue && typeInput === 'object') {
    Object.keys(inputValue).forEach(function (key) {
      const contentElementMerge = mergeJson(inputValue[key], outputValue[key]);
      outputValue[key] = contentElementMerge;
    })
  }
  return outputValue;
}

/**
 * Recursively create directory path
 * @param {string} path_
 * @returns {void}
 */
export function mkDir(path_) {
  const parent = path.join(path_, '..');
  if (!(fs.existsSync(parent) && !fs.statSync(parent).isFile())) {
    mkDir(parent);
  }
  fs.mkdirSync(path_);
}
