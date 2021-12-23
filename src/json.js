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

const transCardArray = require('./templater/bind').transCardArray
const resourceReferenceParsing = require('./resource-reference-script')

import { logWarn } from './util'

const REG_EVENT_STRING = /("\s*\$event\..+")|('\s*\$event\..+')/g
const REG_EVENT = /\$event\.[\w]+/g
const REG_THIS = /this\..*/g

module.exports = function (source) {
  this.cacheable && this.cacheable()

  const extName = path.extname(this.resourcePath)
  if (process.env.DEVICE_LEVEL === 'card') {
    source = source.replace(/\/\*((\n|\r|.)*?)\*\//mg, "")
    source = source.replace(/(\s|\;|^|\{|\})\/\/.*$/mg, "$1")
    if (extName === '.js' || extName === '.json') {
      if(source.trim().indexOf('export default') === 0) {
        source = source.replace('export default', '')
      }
      source = resourceReferenceParsing(source)
      source = source.replace(REG_EVENT_STRING, item => {
        return item.slice(1,-1)
      })
      source = source.replace(REG_EVENT, item => {
        return '"' + item + '"'
      })
      source = source.replace(REG_THIS, item => {
        if (item.charAt(item.length-1) !== '\"' &&
          item.charAt(item.length-1) !== '\'' &&
          item.slice(-2) !== '\"\,' &&
          item.slice(-2) !== '\'\,') {
          if (item.charAt(item.length-1) === ',') {
            item = `"{{${transCardArray(item.slice(0, -1))}}}",`.replace(/this\./g, '')
          } else {
            item = `"{{${transCardArray(item)}}}"`.replace(/this\./g,'')
          }
        }
        return item
      })
      if (extName === '.js') {
        try {
          source = JSON.stringify(eval('(' + source + ')'))
        } catch (e) {
          logWarn(this, [{
            reason: 'ERROR: Failed to parse the file : ' + this.resourcePath + `\n${e}`
          }])
          return `{}`
        }
      } else {
        return source
      }
    }
  }
  return `module.exports = ${source}`
}
