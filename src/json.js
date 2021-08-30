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

const path = require('path')

const cardJsonPlugin = require('./cardJson-plugin')
const transCardArray = require('./templater/bind').transCardArray
const ResourceReferenceParsing = require('./resource-reference-script')
import { logWarn } from './util'

const REG_EVENT_STRING = /("\s*\$event\..+")|('\s*\$event\..+')/g
const REG_EVENT = /\$event\.[\w]+/g
const REG_THIS = /this\..*/g

module.exports = function (source) {
  this.cacheable && this.cacheable()

  if (process.env.DEVICE_LEVEL === 'card') {
    try {
      source = parseCard(this, source)
    }
    catch (e) {
      logWarn(this, [{
        reason: 'ERROR: Failed to parse the file : ' + this.resourcePath + `\n${e}`
      }])
      return '{}'
    }
    return '{}'
  }
  return `module.exports = ${source}`
}

function parseCard(_this, source) {
  source = source.replace(/\/\*((\n|\r|.)*?)\*\//mg,"")
  source = source.replace(/(\s|\;|^|\{|\})\/\/.*$/mg,"$1")
  if (source.trim().indexOf('export default') === 0) {
    source = source.replace('export default', '')
  }
  const extName = path.extname(_this.resourcePath)
  if (extName === '.json' || extName === '.js') {
    source = ResourceReferenceParsing(source)
    source = source.replace(REG_EVENT_STRING, item => {
      return item.slice(1, -1)
    })
    source = source.replace(REG_EVENT, item => {
      return '"' + item + '"'
    })
    source = source.replace(REG_THIS, item => {
      if (item.charAt(item.length - 1) !== '\"' && item.charAt(item.length - 1) !== '\'' &&
        item.slice(-2) !== '\"\,' && item.slice(-2) !== '\'\,') {
          if (item.charAt(item.length - 1) === ',') {
            item = `"{{${transCardArray(item.slice(0, -1))}}}",`.replace(/this\./g, '')
          } else {
            item = `"{{${transCardArray(item)}}}"`.replace(/this\./g, '')
          }
        }
      return item
    })
  }
  source = JSON.stringify(eval('(' + source + ')'))
  const jsonPaths = mkJsonFiles(_this)
  cardJsonPlugin.compileJson(_this._compiler, 'init', jsonPaths.indexJson)
  if (jsonPaths.element) {
    if (extName === '.json' || extName === '.js') {
      cardJsonPlugin.compileJson(_this._compiler, jsonPaths.element, jsonPaths.indexJson,
        processActions(JSON.parse(source).actions, _this), jsonPaths.element, 'actions')
      cardJsonPlugin.compileJson(_this._compiler, jsonPaths.element, jsonPaths.indexJson,
        validateData(JSON.parse(source).data, _this), jsonPaths.element, 'data')
      cardJsonPlugin.compileJson(_this._compiler, jsonPaths.element, jsonPaths.indexJson,
        validateData(JSON.parse(source).apiVersion, _this), jsonPaths.element, 'apiVersion')
      cardJsonPlugin.compileJson(_this._compiler, jsonPaths.element, jsonPaths.indexJson,
        replacePropsArray(JSON.parse(source).props, _this), jsonPaths.element, 'props')
    } else if (extName === '.css' || extName === '.less' || extName === '.sass' || extName === '.scss') {
      cardJsonPlugin.compileJson(_this._compiler, jsonPaths.element, jsonPaths.indexJson, JSON.parse(source),
        jsonPaths.element, 'styles')
    } else if (extName === '.hml') {
      cardJsonPlugin.compileJson(_this._compiler, jsonPaths.element, jsonPaths.indexJson, JSON.parse(source),
        jsonPaths.element, 'template')
    }
  } else {
    if (extName === '.json' || extName === '.js') {
      cardJsonPlugin.compileJson(_this._compiler, 'actions', jsonPaths.indexJson,
        processActions(JSON.parse(source).actions, _this), 'actions')
      cardJsonPlugin.compileJson(_this._compiler, 'data', jsonPaths.indexJson,
        validateData(JSON.parse(source).data, _this), 'data')
      cardJsonPlugin.compileJson(_this._compiler, 'apiVersion', jsonPaths.indexJson,
        validateData(JSON.parse(source).apiVersion, _this), 'apiVersion')
    } else if (extName === '.css' || extName === '.less' || extName === '.sass' || extName === '.scss') {
      cardJsonPlugin.compileJson(_this._compiler, 'styles', jsonPaths.indexJson, JSON.parse(source), 'styles')
    } else if (extName === '.hml') {
      cardJsonPlugin.compileJson(_this._compiler, 'template', jsonPaths.indexJson, JSON.parse(source), 'template')
    }
  }
  return source
}

function mkJsonFiles(_this) {
  let indexJson = ''
  let element
  const resourceQuery = _this.resourceQuery.split('#');
  const entrys = _this._compiler.options.entry
  const resourcePath = _this.resourcePath
  Object.keys(entrys).forEach(function (key) {
    if (path.dirname(path.resolve(entrys[key]['import'][0])) === path.dirname(resourcePath)) {
      indexJson = key + '.json'
    } else {
      indexJson = key + '.json'
      element = resourceQuery[0].slice(1)
    }
  })
  indexJson = path.resolve(_this._compiler.options.output.path, indexJson)
  return { indexJson: indexJson, element: element }
}

function replacePropsArray(propsValue, _this) {
  if (!propsValue) {
    return propsValue
  }
  if (Array.isArray(propsValue)) {
    const propsObject = {}
    propsValue.forEach(item => {
      if (typeof(item) !== 'string') {
        logWarn(_this, [{
          reason: `WARNING: The props value type should be 'string', not '${typeof(item)}' in props array in custom elements.`
        }])
      }
      propsObject[item] = { 'default': '' }
    })
    propsValue = propsObject
  } else if (Object.prototype.toString.call(propsValue) === '[object Object]') {
    Object.keys(propsValue).forEach(item => {
      if (Object.prototype.toString.call(propsValue[item]) !== '[object Object]') {
        logWarn(_this, [{
          reason: 'WARNING: The props default value type can only be Object in custom elements.'
        }])
      }
      if (!propsValue[item].hasOwnProperty('default')) {
        propsValue[item] = { 'default': '' }
      }
    })
  } else {
    logWarn(_this, [{
      reason: 'WARNING: The props type can only be Array or Object in custom elements.'
    }])
  }
  return propsValue
}

function processActions(actionsValue, _this) {
  if (Object.prototype.toString.call(actionsValue) === '[object Object]') {
    Object.keys(actionsValue).forEach(item => {
      if (actionsValue[item].method) {
        if (typeof(actionsValue[item].method) === 'string') {
          if (actionsValue[item].method.toLowerCase() !== actionsValue[item].method) {
            logWarn(_this, [{
              reason: `WARNING: The key method '${actionsValue[item].method}' in the actions don't support uppercase letters.`
            }])
            actionsValue[item].method = actionsValue[item].method.toLowerCase()
          }
        } else {
          logWarn(_this, [{
            reason: `WARNING: The key method type in the actions should be 'string', not '${typeof(actionsValue[item].method)}'.`
          }])
        }
      }
    })
  } else {
    if (actionsValue) {
      logWarn(_this, [{
        reason: 'WARNING: The actions value type can only be Object.'
      }])
    }
  }
  return actionsValue
}

function validateData(dataValue, _this) {
  if (dataValue && Object.prototype.toString.call(dataValue) !== '[object Object]') {
    logWarn(_this, [{
      reason: 'WARNING: The data value type can only be Object.'
    }])
  }
  return dataValue
}
