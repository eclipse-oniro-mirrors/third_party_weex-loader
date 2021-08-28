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

import {
  logWarn
} from './util'

import {
  parseTemplate
} from './parser'
const compiler = require('./lite/lite-transform-template')
const { DEVICE_LEVEL } = require('./lite/lite-enum')
module.exports = function (source) {
  if (process.env.DEVICE_LEVEL !== DEVICE_LEVEL.RICH && source.lastIndexOf('</element>') > 0) {
    const count = source.lastIndexOf('</element>')
    source = source.substr(count + 10, source.length)
  }
  this.cacheable && this.cacheable()

  const callback = this.async()

  let hasError = false
  parseTemplate(source, this.resourcePath)
    .then(({ parsed, log }) => {
      if (log && log.length) {
        hasError = logWarn(this, log)
      }
      // If there is an error during compilation, an empty object is returned
      if (process.env.DEVICE_LEVEL === DEVICE_LEVEL.LITE) {
        if (hasError) {
          parsed = `function () { return {} }`
        }
        else {
          parsed = compiler.transformTemplate(parsed)
        }
      }
      callback(null, parsed)
    }).catch(e => {
      logWarn(this, [{
        reason: 'ERROR: Failed to parse the HML file. ' + e
      }])
      callback('')
    })
}
