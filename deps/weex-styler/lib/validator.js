
var util = require('./util')
var OHOS_THEME_PROP_GROUPS = require('../../theme/ohosStyles');

// http://www.w3.org/TR/css3-color/#html4
var BASIC_COLOR_KEYWORDS = {
  black: '#000000',
  silver: '#C0C0C0',
  gray: '#808080',
  white: '#FFFFFF',
  maroon: '#800000',
  red: '#FF0000',
  purple: '#800080',
  fuchsia: '#FF00FF',
  green: '#008000',
  lime: '#00FF00',
  olive: '#808000',
  yellow: '#FFFF00',
  navy: '#000080',
  blue: '#0000FF',
  teal: '#008080',
  aqua: '#00FFFF'
}

// http://www.w3.org/TR/css3-color/#svg-color
var EXTENDED_COLOR_KEYWORDS = {
  aliceblue: '#F0F8FF',
  antiquewhite: '#FAEBD7',
  aqua: '#00FFFF',
  aquamarine: '#7FFFD4',
  azure: '#F0FFFF',
  beige: '#F5F5DC',
  bisque: '#FFE4C4',
  black: '#000000',
  blanchedalmond: '#FFEBCD',
  blue: '#0000FF',
  blueviolet: '#8A2BE2',
  brown: '#A52A2A',
  burlywood: '#DEB887',
  cadetblue: '#5F9EA0',
  chartreuse: '#7FFF00',
  chocolate: '#D2691E',
  coral: '#FF7F50',
  cornflowerblue: '#6495ED',
  cornsilk: '#FFF8DC',
  crimson: '#DC143C',
  cyan: '#00FFFF',
  darkblue: '#00008B',
  darkcyan: '#008B8B',
  darkgoldenrod: '#B8860B',
  darkgray: '#A9A9A9',
  darkgreen: '#006400',
  darkgrey: '#A9A9A9',
  darkkhaki: '#BDB76B',
  darkmagenta: '#8B008B',
  darkolivegreen: '#556B2F',
  darkorange: '#FF8C00',
  darkorchid: '#9932CC',
  darkred: '#8B0000',
  darksalmon: '#E9967A',
  darkseagreen: '#8FBC8F',
  darkslateblue: '#483D8B',
  darkslategray: '#2F4F4F',
  darkslategrey: '#2F4F4F',
  darkturquoise: '#00CED1',
  darkviolet: '#9400D3',
  deeppink: '#FF1493',
  deepskyblue: '#00BFFF',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1E90FF',
  firebrick: '#B22222',
  floralwhite: '#FFFAF0',
  forestgreen: '#228B22',
  fuchsia: '#FF00FF',
  gainsboro: '#DCDCDC',
  ghostwhite: '#F8F8FF',
  gold: '#FFD700',
  goldenrod: '#DAA520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#ADFF2F',
  grey: '#808080',
  honeydew: '#F0FFF0',
  hotpink: '#FF69B4',
  indianred: '#CD5C5C',
  indigo: '#4B0082',
  ivory: '#FFFFF0',
  khaki: '#F0E68C',
  lavender: '#E6E6FA',
  lavenderblush: '#FFF0F5',
  lawngreen: '#7CFC00',
  lemonchiffon: '#FFFACD',
  lightblue: '#ADD8E6',
  lightcoral: '#F08080',
  lightcyan: '#E0FFFF',
  lightgoldenrodyellow: '#FAFAD2',
  lightgray: '#D3D3D3',
  lightgreen: '#90EE90',
  lightgrey: '#D3D3D3',
  lightpink: '#FFB6C1',
  lightsalmon: '#FFA07A',
  lightseagreen: '#20B2AA',
  lightskyblue: '#87CEFA',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#B0C4DE',
  lightyellow: '#FFFFE0',
  lime: '#00FF00',
  limegreen: '#32CD32',
  linen: '#FAF0E6',
  magenta: '#FF00FF',
  maroon: '#800000',
  mediumaquamarine: '#66CDAA',
  mediumblue: '#0000CD',
  mediumorchid: '#BA55D3',
  mediumpurple: '#9370DB',
  mediumseagreen: '#3CB371',
  mediumslateblue: '#7B68EE',
  mediumspringgreen: '#00FA9A',
  mediumturquoise: '#48D1CC',
  mediumvioletred: '#C71585',
  midnightblue: '#191970',
  mintcream: '#F5FFFA',
  mistyrose: '#FFE4E1',
  moccasin: '#FFE4B5',
  navajowhite: '#FFDEAD',
  navy: '#000080',
  oldlace: '#FDF5E6',
  olive: '#808000',
  olivedrab: '#6B8E23',
  orange: '#FFA500',
  orangered: '#FF4500',
  orchid: '#DA70D6',
  palegoldenrod: '#EEE8AA',
  palegreen: '#98FB98',
  paleturquoise: '#AFEEEE',
  palevioletred: '#DB7093',
  papayawhip: '#FFEFD5',
  peachpuff: '#FFDAB9',
  peru: '#CD853F',
  pink: '#FFC0CB',
  plum: '#DDA0DD',
  powderblue: '#B0E0E6',
  purple: '#800080',
  red: '#FF0000',
  rosybrown: '#BC8F8F',
  royalblue: '#4169E1',
  rebeccapurple: '#663399',
  saddlebrown: '#8B4513',
  salmon: '#FA8072',
  sandybrown: '#F4A460',
  seagreen: '#2E8B57',
  seashell: '#FFF5EE',
  sienna: '#A0522D',
  silver: '#C0C0C0',
  skyblue: '#87CEEB',
  slateblue: '#6A5ACD',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#FFFAFA',
  springgreen: '#00FF7F',
  steelblue: '#4682B4',
  tan: '#D2B48C',
  teal: '#008080',
  thistle: '#D8BFD8',
  tomato: '#FF6347',
  turquoise: '#40E0D0',
  violet: '#EE82EE',
  wheat: '#F5DEB3',
  white: '#FFFFFF',
  whitesmoke: '#F5F5F5',
  yellow: '#FFFF00',
  yellowgreen: '#9ACD32'
}

var DEFAULT_ANIMATION = {
    animationDuration : "0ms",
    animationDelay : "0ms",
    animationDirection : 'normal',
    animationTimingFunction : 'ease',
    animationPlayState : 'running',
    animationIterationCount : 1,
    animationFillMode : 'none'
}

var LENGTH_REGEXP = /^[-+]?\d*\.?\d+(\S*)$/
var LINE_GRADIENT_ITEM_REGEXP = /^([0-9a-zA-Z-]+)\((.*)\)/
var LINE_GRADIENT_DIRECTION_REGEXP = /^\s*(to|bottom|right|left|top)|[-+]?[0-9]*\.?[0-9]+(.*)/
var LINE_GRADIENT_TO_DIRECTION_REGEXP = /(to|bottom|right|left|top)/
var ANGLE_REGEXP = /^[-+]?[0-9]*\.?[0-9]+(.*)/
var ARRAY_COLOR_STOP_REGEXP = /(rgba|rgb)\([0-9,.\spx%vpfp]+\)\s?[0-9-+px%vpfp]*|[#]?\w+\s?[0-9+-\spx%vpfp]*/gi
var URL_REGEXP = /^url\(\s*['"]?\s*([^()]+?)\s*['"]?\s*\)$/
var NAME_REGEXP = /^[a-zA-Z_]+[a-zA-Z0-9-]*$/
var INT_REGEXP = /^[-+]?[0-9]+$/
var ID_REGEXP = /^\"@id\d+\"$/
var NORMAL_REGEXP =  /^normal$/
var AUTO_REGEXP = /^auto$/
var DATE_REGEXP = /(^([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((1[02]|0?[13578])-([12][0-9]|3[01]|0?[1-9]))|((11|0?[469])-(30|[12][0-9]|0?[1-9]))|(0?2-(1[0-9]|2[0-8]|0?[1-9])))$)|(^(([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[13579][26])00))-(0?)2-29$)/
var TRANSFORM_REGEXP = /[0-9a-zA-Z]+\s*\(\s*[0-9(a-zA-Z-|%)\.]+\s*(,\s*[0-9(a-zA-Z-|%)\.]+)*\)/g
var TRANSFORM_ITEM_REGEXP = /^([0-9a-zA-Z]+)\s*\((.*)\)$/
var FILTER_REGEXP = /^blur\(([1-9]\d*|0)(px|fp|vp)\)$/
var FILTER_PERCENTAGE_REGEXP = /^blur\(([1-9]?\d|100)%\)$/
var FILTER_STYLE_REGEXP = /^blur\(([1-9]?\d|100)%\)\s+[A-Za-z_]+$/
var SUPPORT_CSS_EXPRESSION = /calc\(|var\(\-\-/
var SUPPORT_VAR_EXPRESSION = /var\(\-\-/
var SUPPORT_CSS_UNIT = ['px', 'pt', 'wx', 'vp', 'fp']
var SUPPORT_CSS_TIME_UNIT = ['ms', 's']
var SUPPORT_CSS_PERCENTAGE_UNIT = ['px', '%', 'vp', 'fp']
var SUPPORT_CSS_GRID_UNIT = ['px', '%', 'fr', 'vp', 'fp']
var SUPPORT_CSS_TEXT_INDENT_UNIT = ['px', 'cm', '%', 'em', 'vp', 'fp']
var SUPPORT_CSS_ANGLE_UNIT = ["deg", "rad", "grad", "turn"]
var logTypes = ["NOTE", "WARNING", "ERROR"]

var ANYTHING_VALIDATOR = function ANYTHING_VALIDATOR(v) {
  v = (v || '').toString().trim()
  return { value: v }
}

/**
 * the values below is valid
 * - auto
 * - number
 * - number + 'px'|'%'|'vp'| 'fp'
 *
 * @param {string} v
 * @return {function} a function to return
 * - value: number|null
 * - reason(k, v, result)
 */
var AUTO_PERCENTAGE_LENGTH_VALIDATOR = function AUTO_PERCENTAGE_LENGTH_VALIDATOR(v) {
  v = (v || '').toString().trim()
  if (v.match(AUTO_REGEXP)) {
    return { value: v }
  } else if (v.match(ID_REGEXP)) {
    return { value: v }
  } else if (v.match(SUPPORT_CSS_EXPRESSION)) {
    return { value: v }
  } else {
    return LENGTH(v, SUPPORT_CSS_PERCENTAGE_UNIT)
  }
}

/**
 * the values below is valid
 * - number
 * - number + 'px'|'%'|'vp'| 'fp'
 *
 * @param {string} v
 * @return {function} a function to return
 * - value: number|null
 * - reason(k, v, result)
 */
var PERCENTAGE_LENGTH_VALIDATOR = function PERCENTAGE_LENGTH_VALIDATOR(v) {
  v = (v || '').toString().trim()
  if (v.match(ID_REGEXP)) {
    return { value: v }
  } else if (v.match(SUPPORT_CSS_EXPRESSION)) {
    return { value: v }
  } else {
    return LENGTH(v, SUPPORT_CSS_PERCENTAGE_UNIT)
  }
}

/**
 * the values below is valid
 * - number
 * - number + 'px'
 *
 * @param {string} v
 * @return {function} a function to return
 * - value: number|null
 * - reason(k, v, result)
 */
var LENGTH_VALIDATOR = function LENGTH_VALIDATOR(v) {
  v = (v || '').toString().trim()
  if (v.match(SUPPORT_CSS_EXPRESSION)) {
    return { value: v }
  } else if (v.match(ID_REGEXP)) {
    return { value: v }
  } else {
    return LENGTH(v, SUPPORT_CSS_UNIT)
  }
}

var LENGTH = function LENGTH(v, SUPPORT_UNIT) {
  v = (v || '').toString().trim()
  var match = v.match(LENGTH_REGEXP)

  if (match) {
    var unit = match[1]
    if (!unit) {
      return v === '0' ? { value: parseFloat(v) + SUPPORT_UNIT[0] } :
        {
          value: parseFloat(v) + SUPPORT_UNIT[0],
          reason: function(k, v) {
            return 'WARNING: No unit is specified for the `' + util.camelCaseToHyphened(k) +
              '` attribute. The default unit is ' + SUPPORT_UNIT[0]
          }
        }
    } else if (SUPPORT_UNIT.indexOf(unit) > -1) {
      return { value: v }
    } else {
      return {
        value: parseFloat(v) + SUPPORT_UNIT[0],
        reason: function reason(k, v, result) {
          return 'ERROR: The `' + k + '` attribute does not support `' + unit +
            '`. The default unit is ' + SUPPORT_UNIT[0]
        }
      }
    }
  }

  if (v.indexOf('@') >= 0) {
    let result
    // target format "@sys.float.id_sys_length" or '@sys.float.id_sys_length'
    let SysResourceTypeRefReg = /['"]\s*@sys\.float\.(?<resName>\w+)\s*['"]/
    result = SysResourceTypeRefReg.exec(v)
    if (result) {
      const resourceName = result.groups['resName']
      if (resourceName && OHOS_THEME_PROP_GROUPS[resourceName]) {
        return { value: "@sys.float." + OHOS_THEME_PROP_GROUPS[resourceName] }
      }
    }
    // target format "@app.float.developer_defined_length" or '@app.float.developer_defined_length'
    let AppResourceTypeRefReg = /['"]\s*@app\.float\.(?<resName>\w+)\s*['"]/
    result = AppResourceTypeRefReg.exec(v)
    if (result) {
      const resourceName = result.groups['resName']
      if (resourceName) {
        return { value: "@app.float." + resourceName}
      }
    }
    // target format "@id_sys_length" or '@id_sys_length' or @id_sys_length
    let ResourceRefReg = /['"]?\s*@(?<resName>\w+)\s*['"]?/
    result = ResourceRefReg.exec(v)
    if (result) {
      const resourceName = result.groups['resName']
      if (resourceName && OHOS_THEME_PROP_GROUPS[resourceName]) {
        return { value: "@ohos_id_" + OHOS_THEME_PROP_GROUPS[resourceName] }
      }
    }
  }

  return {
    value: null,
    reason: function reason(k, v, result) {
      return 'ERROR: The `' + util.camelCaseToHyphened(k) + '` attribute does not support the `' +
        v + '` value (only numbers are supported).'
    }
  }
}

var TEXT_INDENT_VALIDATOR = function TEXT_INDENT_VALIDATOR(v) {
  return LENGTH(v, SUPPORT_CSS_TEXT_INDENT_UNIT)
}

var TEXT_LINE_HEIGHT_VALIDATOR = function TEXT_LINE_HEIGHT_VALIDATOR(v) {
  v = (v || '').toString().trim()

  if (v.match(NORMAL_REGEXP)) {
    return { value: v }
  } else {
    return LENGTH_VALIDATOR(v)
  }
}

/**
 * the values below is valid
 * - number
 * - number + 'ms'|'s'
 *
 * @param {string} v
 * @return {function} a function to return
 * - value: number|null
 * - reason(k, v, result)
 */
var TIME_VALIDATOR = function TIME_VALIDATOR(v) {
  return LENGTH(v, SUPPORT_CSS_TIME_UNIT)
}

/**
 * the values below is valid
 * - number {1,4}
 * - number + 'px' {1,4}
 *
 * @param {string} v
 * @return {function} a function to return
 * - value: number|null
 * - reason(k, v, result)
 */
var SHORTHAND_PERCENTAGE_LENGTH_VALIDATOR = function SHORTHAND_PERCENTAGE_LENGTH_VALIDATOR(v) {
  v = (v || '').toString().trim()
  let rule = PERCENTAGE_LENGTH_VALIDATOR
  return SHORTHAND_VALIDATOR(v, rule)
}

var SHORTHAND_AUTO_PERCENTAGE_LENGTH_VALIDATOR = function SHORTHAND_AUTO_PERCENTAGE_LENGTH_VALIDATOR(v) {
  v = (v || '').toString().trim()
  let rule = AUTO_PERCENTAGE_LENGTH_VALIDATOR
  return SHORTHAND_VALIDATOR(v, rule)
}

var SHORTHAND_LENGTH_VALIDATOR = function SHORTHAND_LENGTH_VALIDATOR(v) {
  v = (v || '').toString().trim()
  let rule = LENGTH_VALIDATOR
  return SHORTHAND_VALIDATOR(v, rule)
}

var ARRAY_LENGTH_VALIDATOR = function ARRAY_LENGTH_VALIDATOR(v) {
  v = (v || '').toString().trim().replace(/,/g, ' ')
  var isArray = true
  return SHORTHAND_VALIDATOR(v, LENGTH_VALIDATOR, isArray)
}

/**
 * the values below is valid
 * - hex color value (#xxxxxx or #xxx)
 * - basic and extended color keywords in CSS spec
 * - expression
 *
 * @param {string} v
 * @return {function} a function to return
 * - value: string|null
 * - reason(k, v, result)
 */
var COLOR_VAR_VALIDATOR = function COLOR_VAR_VALIDATOR(v) {
  v = (v || '').toString().trim()
  if (v.match(SUPPORT_VAR_EXPRESSION)) {
    return { value: v }
  } else {
    return COLOR_VALIDATOR(v)
  }
}

/**
 * the values below is valid
 * - hex color value (#xxxxxx or #xxx)
 * - basic and extended color keywords in CSS spec
 *
 * @param {string} v
 * @return {function} a function to return
 * - value: string|null
 * - reason(k, v, result)
 */
var COLOR_VALIDATOR = function COLOR_VALIDATOR(v) {
  v = (v || '').toString().trim()

  if (v.indexOf('linear-gradient') >= 0) {
    let result = {
      values: []
    }
    let temp = LINEAR_GRADIENT_VALIDATOR(v)
    if (util.isValidValue(temp.value)) {
      let tempValue = JSON.parse(temp.value)
      result.values.push(tempValue)
      return { value: JSON.stringify(result) }
    } else {
      return temp
    }
  }

  if (v.match(ID_REGEXP)) {
    return { value: v }
  }

  if (v.indexOf('@') >= 0) {
    let result
    // target format "@sys.color.id_color_background" or '@sys.color.id_color_background'
    let SysResourceTypeRefReg = /['"]\s*@sys\.color\.(?<resName>\w+)\s*['"]/
    result = SysResourceTypeRefReg.exec(v)
    if (result) {
      const resourceName = result.groups['resName']
      if (resourceName && OHOS_THEME_PROP_GROUPS[resourceName]) {
        return { value: "@sys.color." + OHOS_THEME_PROP_GROUPS[resourceName] }
      }
    }
    // target format "@app.color.developer_defined_color" or '@app.color.developer_defined_color'
    let AppResourceTypeRefReg = /['"]\s*@app\.color\.(?<resName>\w+)\s*['"]/
    result = AppResourceTypeRefReg.exec(v)
    if (result) {
      const resourceName = result.groups['resName']
      if (resourceName) {
        return { value: "@app.color." + resourceName}
      }
    }
    // target format "@id_color_background" or '@id_color_background' or @id_color_background
    let ResourceRefReg = /['"]?\s*@(?<resName>\w+)\s*['"]?/
    result = ResourceRefReg.exec(v)
    if (result) {
      const resourceName = result.groups['resName']
      if (resourceName && OHOS_THEME_PROP_GROUPS[resourceName]) {
        return { value: "@ohos_id_" + OHOS_THEME_PROP_GROUPS[resourceName] }
      }
    }
  }

  if (v.match(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/)) {
    return { value: v }
  }

  if (v.match(/^#[0-9a-fA-F]{3}$/)) {
    return {
      value: '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3],
      reason: function reason(k, v, result) {
        return 'NOTE: Attribute value `' + v + '` is automatically fixed to `' + result + '`.'
      }
    }
  }

  if (EXTENDED_COLOR_KEYWORDS[v]) {
    return {
      value: EXTENDED_COLOR_KEYWORDS[v],
      reason: function reason(k, v, result) {
        return 'NOTE: Attribute value `' + v + '` is automatically fixed to `' + result + '`.'
      }
    }
  }

  if (v === 'transparent' || v === 'none') {
    return { value: 'rgba(0,0,0,0)' }
  }

  const returnColorReg = COLOR_REG(v)
  if (returnColorReg.value !== null) {
    return returnColorReg
  }

  return {
    value: null,
    reason: function reason(k, v, result) {
      return 'ERROR: Value `' + v + '` is invalid for the `' + util.camelCaseToHyphened(k) + '` attribute.'
    }
  }
}

var COLOR_REG = function COLOR_REG(v) {
  let arrColor, r, g, b, a
  const RGB_REGEXP = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/gi
  const RGBA_REGEXP = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d*\.?\d+)\s*\)$/gi
  const HSL_REGEXP = /^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/gi
  const HSLA_REGEXP = /^hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d*\.?\d+)\s*\)$/gi
  if (arrColor = RGB_REGEXP.exec(v)) {
    r = parseInt(arrColor[1])
    g = parseInt(arrColor[2])
    b = parseInt(arrColor[3])
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      return { value: 'rgb(' + [r, g, b].join(',') + ')' }
    }
  }
  if (arrColor = RGBA_REGEXP.exec(v)) {
    r = parseInt(arrColor[1])
    g = parseInt(arrColor[2])
    b = parseInt(arrColor[3])
    a = parseFloat(arrColor[4])
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255 && a >= 0 && a <= 1) {
      return { value: 'rgba(' + [r, g, b, a].join(',') + ')' }
    }
  }
  if (arrColor = HSL_REGEXP.exec(v)) {
    r = arrColor[1]
    g = arrColor[2]
    b = arrColor[3]
    if (r >= 0 && r <= 360 && g >= 0 && g <= 100 && b >= 0 && b <= 100) {
      return { value: 'hsl(' + [r, g+'%', b+'%'].join(',') + ')' }
    }
  }
  if (arrColor = HSLA_REGEXP.exec(v)) {
    r = arrColor[1]
    g = arrColor[2]
    b = arrColor[3]
    a = arrColor[4]
    if (r >= 0 && r <= 360 && g >= 0 && g <= 100 && b >= 0 && b <= 100 && a >= 0 && a <= 1) {
      return { value: 'hsla(' + [r, g+'%', b+'%', a].join(',') + ')' }
    }
  }

  return { value: null }
}

/**
 * the values below is valid
 * - color {1,4}
 *
 * @param {string} v
 * @return {function} a function to return
 * - value: color|null
 * - reason(k, v, result)
 */
var SHORTHAND_COLOR_VALIDATOR = function SHORTHAND_COLOR_VALIDATOR(v) {
  v = (v || '').toString().trim()
  v = v.replace(/\s*,\s+/g, ',')
  return SHORTHAND_VALIDATOR(v, COLOR_VAR_VALIDATOR)
}

var ARRAY_COLOR_VALIDATOR = function ARRAY_COLOR_VALIDATOR(v) {
  v = (v || '').toString().trim()
  var isArray = true
  return SHORTHAND_VALIDATOR(v.replace(/,/g, ' '), COLOR_VAR_VALIDATOR, isArray)
}

var SHORTHAND_STYLE_VALIDATOR = function SHORTHAND_STYLE_VALIDATOR(v) {
  v = (v || '').toString().trim()
  return SHORTHAND_VALIDATOR(v, STYLE_VALIDATOR)
}

var STYLE_VALIDATOR = function STYLE_VALIDATOR(v) {
  const styleList = ["solid", "dashed", "dotted"]
  v = (v || '').toString().trim()
  if (styleList.includes(v)) {
    return { value:v }
  } else {
    return {
      value: null,
      reason: function (k,v) {
        return 'ERROR: The `' + util.camelCaseToHyphened(k) + '` attribute does not support value `' +
          v + '` (the support value is `' + styleList.join('`|`') + '`).'
      }
    }
  }
}

var SHORTHAND_VALIDATOR = function SHORTHAND_VALIDATOR(v, validateFunction, isArray) {
  v = (v || '').toString().trim()
  let value = []
  let reason = []
  let results = v.split(/(?<!\+|\-|\*|\/|\,)\s+(?!\+|\-|\*|\/|\,)/).map(validateFunction)
  for (let i = 0; i < results.length; ++i) {
    let res = results[i]
    if (!res.value) {
      value = null
      reason = res.reason
      break
    }
    value.push(res.value)
    if (res.reason) {
      reason.push(res.reason)
    }
  }

  if (!value) {
    return {
      value: value,
      reason: reason
    }
  }
  else {
    return {
      value: isArray ? value.join(',') : value.join(' '),
      reason: reason.length > 0 ? function (k, v, result) {
        return reason.map(function (res) {
          if (typeof res === 'function') {
            return res(k, v, result)
          }
        }).join('\n')
      } : null
    }
  }
}

var BORDER_VALIDATOR = function BORDER_VALIDATOR (value, name) {
  value = (value || '').toString().trim();
  let values = '';
  const colorAttribute = value.match(/\(.*?\)/g);
  if (colorAttribute && colorAttribute.length === 1) {
    values = value.replace(colorAttribute[0], colorAttribute[0].replace(/\s+/g, '')).split(/\s+/);
  } else {
    values = value.split(/\s+/);
  }
  const res = []
  let hasError = false
  const reasons = []
  let index = 0
  const order = []
  let validatorResult
  const rules = [
    {
      match (item) { return LENGTH_VALIDATOR(item).value },
      action (item) {
        validatorResult = LENGTH_VALIDATOR(item)
        order.push(0)
        res.push({
          value: validatorResult.value,
          type: 'Width'
        })
      }
    },
    {
      match (item) { return validate('borderStyle', item).value },
      action (item) {
        validatorResult = validate('borderStyle', item)
        order.push(1)
        res.push({
          value: validatorResult.value,
          type: 'Style'
        })
      }
    },
    {
      match (item) { return COLOR_VAR_VALIDATOR(item).value },
      action (item) {
        validatorResult = COLOR_VAR_VALIDATOR(item)
        order.push(2)
        res.push({
          value: validatorResult.value,
          type: 'Color'
        })
      }
    },
    {
      match () { return true },
      action () {
        hasError = true
      }
    }
  ]
  if (values && values.length <= 3) {
    for (let i = 0; i < values.length; i++) {
      const item = values[i]
      for (let i = 0; i < rules.length; i++) {
        if (rules[i].match(item)) {
          rules[i].action(item)
          break;
        }
      }
      // style width color pass verification, but did not write in order, such as "1px red solid", should be error
      let orderIndex = -1
      order.forEach((item) => {
        orderIndex < item ? orderIndex = item : hasError = true
      })
      // get all warning and note log
      logUtil(validatorResult, name, item, reasons, index)
    }
    // print warning and note
    if (!hasError) {
      return {
        value: res,
        reason: reasons.length > 0 ? function (k, v) {
          return (
            logTypes[index] + ': There are some problems with value `' + v + '` of the `' +
              util.camelCaseToHyphened(k) + '` attribute. \n ' + reasons.join(' \n'))
        } : null
      }
    }
  }
  // print error
  return {
    value: null,
    reason: function reason (k, v, result) {
      return 'ERROR: The `' + util.camelCaseToHyphened(k) +
        '` attribute does not support value `' + v +
        '` (this value does not meet the inspection standards for the width, style, and color).'
    }
  }
}

function logUtil (validatorResult, name, item, reasons, index) {
  if (validatorResult.reason) {
    let str = validatorResult.reason(name, item, validatorResult.value)
    const mesg = str.match(/^([A-Z]+):/)
    // When both warning and note information are included, a high severity sign is output
    const num = logTypes.indexOf(mesg[1])
    if (index < num) {
      index = num
    }
    str = str.replace(mesg[0], '')
    reasons.push(str)
  }
}

var BOX_SHADOW_VALIDATOR = function BOX_SHADOW_VALIDATOR(value, name) {
  value = (value || '').toString().trim()
  const values = value.split(/\s+/)
  let validatorResult
  const res = []
  const order = []
  const reasons = []
  let index = 0
  let ruleIndex = 0
  let hasError = false
  const rules = [
    {
      match (item) { return validate('boxShadowH', item).value },
      action (item) {
        validatorResult = validate('boxShadowH', item)
        order.push(0)
        res.push({
          value: validatorResult.value,
          type: 'H'
        })
      }
    },
    {
      match (item) { return validate('boxShadowV', item).value },
      action (item) {
        validatorResult = validate('boxShadowV', item)
        order.push(1)
        res.push({
          value: validatorResult.value,
          type: 'V'
        })
      }
    },
    {
      match (item) { return validate('boxShadowBlur', item).value },
      action (item) {
        validatorResult = validate('boxShadowBlur', item)
        order.push(2)
        res.push({
          value: validatorResult.value,
          type: 'Blur'
        })
      }
    },
    {
      match (item) { return validate('boxShadowSpread', item).value },
      action (item) {
        validatorResult = validate('boxShadowSpread', item)
        order.push(3)
        res.push({
          value: validatorResult.value,
          type: 'Spread'
        })
      }
    },
    {
      match (item) { return COLOR_VAR_VALIDATOR(item).value },
      action (item) {
        validatorResult = COLOR_VAR_VALIDATOR(item)
        order.push(4)
        res.push({
          value: validatorResult.value,
          type: 'Color'
        })
      }
    }
  ]
  const length = values.length
  const flag = (length <= 6 && length >= 2) && values[0].match(LENGTH_REGEXP) && values[1].match(LENGTH_REGEXP)
  if (values && flag) {
    for (let i = 0; i < values.length; i++) {
      const item = values[i]
      for (let j = ruleIndex; j < rules.length; j++) {
        if (rules[j].match(item)) {
          ruleIndex++
          rules[j].action(item)
          break
        }
      }
      let orderIndex = -1
      order.forEach((item) => {
        orderIndex < item ? orderIndex = item : hasError = true
      })
      // get all warning and note log
      logUtil(validatorResult, name, item, reasons, index)
    }
    if (!hasError) {
      return {
        value: res,
        reason: reasons.length > 0 ? function (k, v) {
          return (
            logTypes[index] + ': There are some problems with value `' + v +
              '` of the `' + util.camelCaseToHyphened(k) + '` attribute. \n ' + reasons.join(' \n'))
        } : null
      }
    }
  }
  return {
    value: null,
    reason: function reason (k, v, result) {
      return 'ERROR: The `' + util.camelCaseToHyphened(k) +
        '` attribute does not support value `' + v +
        '` (this value does not meet the inspection standards).'
    }
  }
}

/**
 * only integer or float value is valid
 *
 * @param {string} v
 * @return {function} a function to return
 * - value: number|null
 * - reason(k, v, result)
 */
var NUMBER_VALIDATOR = function NUMBER_VALIDATOR(v, isInt) {
  v = (v || '').toString().trim()

  if (v.match(ID_REGEXP)) {
    return { value: v }
  }

  var match = v.match(LENGTH_REGEXP)

  if (match && !match[1]) {
    return { value: isInt === true ? parseInt(v, 10) : parseFloat(v) }
  }

  if (v.indexOf('@') >= 0) {
    let result
    // target format "@sys.float.id_sys_number" or '@sys.float.id_sys_number'
    let SysResourceTypeRefReg = /['"]\s*@sys\.float\.(?<resName>\w+)\s*['"]/
    result = SysResourceTypeRefReg.exec(v)
    if (result) {
      const resourceName = result.groups['resName']
      if (resourceName && OHOS_THEME_PROP_GROUPS[resourceName]) {
        return { value: "@sys.float." + OHOS_THEME_PROP_GROUPS[resourceName] }
      }
    }
    // target format "@app.float.developer_defined_number" or '@app.float.developer_defined_number'
    let AppResourceTypeRefReg = /['"]\s*@app\.float\.(?<resName>\w+)\s*['"]/
    result = AppResourceTypeRefReg.exec(v)
    if (result) {
      const resourceName = result.groups['resName']
      if (resourceName) {
        return { value: "@app.float." + resourceName}
      }
    }
    // target format "@id_sys_number" or '@id_sys_number' or @id_sys_number
    let ResourceRefReg = /['"]?\s*@(?<resName>\w+)\s*['"]?/
    result = ResourceRefReg.exec(v)
    if (result) {
      const resourceName = result.groups['resName']
      if (resourceName && OHOS_THEME_PROP_GROUPS[resourceName]) {
        return { value: "@ohos_id_" + OHOS_THEME_PROP_GROUPS[resourceName] }
      }
    }
  }

  return {
    value: null,
    reason: function reason(k, v, result) {
      return 'ERROR: The `' + util.camelCaseToHyphened(k) +
        '` attribute does not support value `' + v + '` (only numbers are supported).'
    }
  }
}

var ARRAY_NUMBER_VALIDATOR = function ARRAY_NUMBER_VALIDATOR(v) {
  v = (v || '').toString().trim().replace(/,/g, ' ')
  var isArray = true
  return SHORTHAND_VALIDATOR(v, NUMBER_VALIDATOR, isArray)
}

/**
 * only integer value is valid
 *
 * @param {string} v
 * @return {function} a function to return
 * - value: number|null
 * - reason(k, v, result)
 */
var INTEGER_VALIDATOR = function INTEGER_VALIDATOR(v) {
  return NUMBER_VALIDATOR(v, true)
}

/**
 * transition-property: only css property is valid
 *
 * @param {string} v
 * @return {function} a function to return
 * - value: string|null
 * - reason(k, v, result)
 */
var TRANSITION_PROPERTY_VALIDATOR = function TRANSITION_PROPERTY_VALIDATOR(v) {
  v = (v || '').toString()
  v = v.split(/\s*,\s*/).map(util.hyphenedToCamelCase).join(',')

  if (v.split(/\s*,\s*/).every(p => !!validatorMap[p])) {
    return {value: v}
  }

  return {
    value: null,
    reason: function reason(k, v, result) {
      return 'ERROR: The `' + util.camelCaseToHyphened(k) + '` attribute does not support value `' +
        v + '` (only CSS attributes support this value).'
    }
  }
}

/**
 * transition-duration & transition-delay: only number of seconds or milliseconds is valid
 *
 * @param {string} v
 * @return {function} a function to return
 * - value: number|null
 * - reason(k, v, result)
 */
var TRANSITION_INTERVAL_VALIDATOR = function TRANSITION_INTERVAL_VALIDATOR(v) {
  v = (v || 0).toString()
  var match, num, ret

  if (match = v.match(/^\d*\.?\d+(ms|s)?$/)) {
    num = parseFloat(match[0])
    if (!match[1]) {
      ret = {value: parseInt(num)}
    }
    else {
      if (match[1] === 's') {
        num *= 1000
      }
      ret = {
        value: parseInt(num),
        reason: function reason(k, v, result) {
          return 'NOTE: Attribute value `' + v + '` is automatically fixed to `' + result + '`.'
        }
      }
    }
    return ret
  }

  return {
    value: null,
    reason: function reason(k, v, result) {
      return 'ERROR: The `' + util.camelCaseToHyphened(k) + '` attribute does not support value `' +
        v + '` (only seconds and milliseconds are supported).'
    }
  }
}

/**
 * transition-timing-function: only linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n) is valid
 *
 * @param {string} v
 * @return {function} a function to return
 * - value: linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n)|null
 * - reason(k, v, result)
 */
var TRANSITION_TIMING_FUNCTION_VALIDATOR = function TRANSITION_TIMING_FUNCTION_VALIDATOR(v) {
  v = (v || '').toString()

  if (v.match(/^linear|ease|ease-in|ease-out|ease-in-out|fast-out-slow-in|linear-out-slow-in$/) ||
    v.match(/^fast-out-linear-in|friction|extreme-deceleration|sharp|rhythm|smooth$/)) {
    return {value: v}
  }

  let match, ret
  let NUM_REGEXP = /^[-]?\d*\.?\d+$/
  if (match = v.match(/^cubic-bezier\(\s*(.*)\s*,\s*(.*)\s*,\s*(.*)\s*,\s*(.*)\s*\)$/)) {
    /* istanbul ignore else */
    if (match[1].match(NUM_REGEXP) && match[2].match(NUM_REGEXP) &&
      match[3].match(NUM_REGEXP) && match[4].match(NUM_REGEXP)) {
      ret = [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]), parseFloat(match[4])].join(',')
      return {value: 'cubic-bezier(' + ret + ')'}
    }
  }

  // check steps
  if (match = v.match(/^steps\(\s*([\d]*)\s*(,\s*(start|end)\s*){0,1}\)$/)) {
    var stepCnt = parseFloat(match[1]);
    if (stepCnt > 0) {
      if (match[3] === undefined) {
        ret = stepCnt;
      } else {
        ret = [stepCnt, match[3]].join(',')
      }
      return {value: 'steps(' + ret + ')'}
    }
  }

  return {
    value: null,
    reason: function reason(k, v, result) {
      return 'ERROR: The `' + util.camelCaseToHyphened(k) + '` attribute does not support value `' + v +
             '` (supported values include `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`,' +
             ' `cubic-bezier(n,n,n,n)` and `steps(n[, start|end])`).'
    }
  }
}

function parseAnimationOption(key, option, style)
{
   var subResult = validate(key, option)
   if (subResult.value) {
       style[key] = subResult.value
       return true
   }
    return false
}

function parseSimpleAnimation(style, animation) {
    // init default animation brief value
    Object.assign(style, DEFAULT_ANIMATION)
    let options = animation.trim().replace(/,\s+/g, ",").split(/\s+/)
    let durationIdx = NaN
    let delayIdx = NaN
    let directionIdx = NaN
    let timingIdx = NaN
    let playStateIdx = NaN
    let iterationIdx = NaN
    let fillModeIdx = NaN
    for (let idx in options) {
        const option = options[idx]
        if (isNaN(timingIdx) && parseAnimationOption('animationTimingFunction', option, style)) {
            timingIdx = idx
            continue
        }
        if (isNaN(directionIdx) && parseAnimationOption('animationDirection', option, style)) {
            directionIdx = idx
            continue
        }
        if (isNaN(playStateIdx) && parseAnimationOption('animationPlayState', option, style)) {
            playStateIdx = idx
            continue
        }
        if (isNaN(iterationIdx) && parseAnimationOption('animationIterationCount', option, style)) {
            iterationIdx = idx
            continue
        }
        if (isNaN(fillModeIdx) && parseAnimationOption('animationFillMode', option, style)) {
            fillModeIdx = idx
            continue
        }
        if (isNaN(durationIdx) && parseAnimationOption('animationDuration', option, style)) {
            durationIdx = idx
            continue
        }
        if (isNaN(delayIdx) && parseAnimationOption('animationDelay', option, style)) {
            delayIdx = idx
            continue
        }
    }
    delete options[durationIdx]
    delete options[delayIdx]
    delete options[directionIdx]
    delete options[timingIdx]
    delete options[playStateIdx]
    delete options[iterationIdx]
    delete options[fillModeIdx]
    options = options.filter(res => { return !(res === 'undefined') })
    if (options.length === 1) {
       if (!parseAnimationOption('animationName', options[0], style)) {
           return false
       }
       return true
    } else if (options.length > 1) {
        return false
    } else {
        // use default.
        return true
    }
}

var ANIMATION_VALIDATOR = function ANIMATION_VALIDATOR(v) {
    var style = {}
    if (parseSimpleAnimation(style, v)) {
        return {value: style}
    } else {
        return {
            value: null,
            reason: function reason(k, v, result) {
                return 'ERROR: animation is invalid'
            }
        }
    }
}

var TRANSFORM_VALIDATOR = function TRANSFORM_VALIDATOR(v) {
  v = (v || '').toString().trim()
  if (v.match(/^none$/)) {
    return { value: JSON.stringify({}) }
  }
  const values = []
  TRANSFORM_REGEXP.lastIndex = 0
  while (true) {
    let matchValue = TRANSFORM_REGEXP.exec(v)
    if (!matchValue) {
      break
    }
    values.push(v.slice(matchValue.index, TRANSFORM_REGEXP.lastIndex))
  }
  if (!values.length) {
    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: The `' + util.camelCaseToHyphened(k) + '` attribute does not support value `' + v + '`.'
      }
    }
  }
  let result = {}
  let reasonMaps = []
  let allLength = 0
  values.forEach(function(v) {
    let length = 0
    let match = v.match(TRANSFORM_ITEM_REGEXP)
    if (match) {
      let firstValue = match[1]
      let secondValue = match[2]
      let checkFuntion = transformValidatorMap[firstValue]
      if (typeof checkFuntion == 'function') {
        var checkResult = checkFuntion(secondValue)
        if (typeof checkResult.value == 'number' || typeof checkResult.value == 'string') {
          result[firstValue] = checkResult.value
        }
        let check = checkReason(checkResult, firstValue, secondValue, length)
        length = check.length
        if (check.realReason) {
          reasonMaps.push(check.realReason)
        }
      } else {
        length = 2
        reasonMaps.push('property `' + firstValue + '` is invalid.')
      }
    } else {
      length = 2
      reasonMaps.push('property value `' + v + '` is invalid.')
    }
    if (allLength < length) {
      allLength = length
    }
  })
  return {
    value: result ? JSON.stringify(result) : null,
    reason: reasonMaps.length > 0 ?
      function(k, v) {
        return logTypes[allLength] + ': Value `' + v + '` of the `' +
          util.camelCaseToHyphened(k) + '` attribute is incorrect. \n ' + reasonMaps.join(' \n ')
      } : null
  }
}

var MULTIPLE_PERCENTAGE_LENGTH_VALIDATOR = function MULTIPLE_PERCENTAGE_LENGTH_VALIDATOR(v) {
  v = (v || '').toString().trim()
  return MULTIPLE_POSITION_VALIDATOR(v, PERCENTAGE_LENGTH_VALIDATOR)
}

var MULTIPLE_NUMBER_VALIDATOR = function MULTIPLE_NUMBER_VALIDATOR(v) {
  v = (v || '').toString().trim()
  return MULTIPLE_POSITION_VALIDATOR(v, NUMBER_VALIDATOR)
}

var MUTIPLE_ANGLE_VALIDATOR = function MUTIPLE_ANGLE_VALIDATOR(v) {
  v = (v || '').toString().trim()
  return MULTIPLE_POSITION_VALIDATOR(v, ANGLE_VALIDATOR)
}

var ROTATE3D_VALIDATOR = function ROTATE3D_VALIDATOR(v) {
  v = (v || '').toString().trim()
  let values = v.split(/,/g)
  if (values && values.length > 0) {
    let resultValues = []
    let childResult = void 0
    let reasonMaps = []
    let length = 0
    if (values.length != 4) {
      length = 2
      reasonMaps.push('The number of properties is 4, value ' + values + ' is incorrect.')
    } else {
      values.forEach(function (value, index) {
        if (index < 3) {
          childResult = NUMBER_VALIDATOR(value)
        } else {
          childResult = ANGLE_VALIDATOR(value)
        }
        if (typeof childResult.value == 'number' || typeof childResult.value == 'string') {
          resultValues.push(childResult.value)
        }
        let check = checkReason(childResult, index.toString(), value, length)
        length = check.length
        if (check.realReason !== null) {
          reasonMaps.push(check.realReason)
        }
      })
    }

    return {
      value: length < 2 ? resultValues.join(' ') : null,
      reason: reasonMaps.length > 0 ?
        function (k, v) {
          return logTypes[length] + ': Value `' + v + '` of the `' + util.camelCaseToHyphened(k) +
            '` attribute is incorrect. \n ' + reasonMaps.join(' \n ')
        } : null
    }
  }
}

var MULTIPLE_POSITION_VALIDATOR = function MULTIPLE_POSITION_VALIDATOR(v, validateFunction) {
  v = (v || '').toString().trim()
  let values = v.split(/,/g)
  if (values && values.length > 0) {
    let resultValues = []
    let childResult = void 0
    let reasonMaps = []
    let length = 0
    if (values.length > 16) {
      length = 2
      reasonMaps.push('The maximum number of properties is 16, value ' + values + ' is incorrect.')
    }
    values.forEach(function (value, index) {
      childResult = validateFunction(value)
      if (typeof childResult.value == 'number' || typeof childResult.value == 'string') {
        resultValues.push(childResult.value)
      }
      let check = checkReason(childResult, index.toString(), value, length)
      length = check.length
      if (check.realReason !== null) {
        reasonMaps.push(check.realReason)
      }
    })
    return {
      value: length < 2 ? resultValues.join(' ') : null,
      reason: reasonMaps.length > 0 ?
        function (k, v) {
          return logTypes[length] + ': Value `' + v + '` of the `' + util.camelCaseToHyphened(k) +
            '` attribute is incorrect. \n ' + reasonMaps.join(' \n ')
        } : null
    }
  }
}

/**
 * generate a function to check whether a value is in `list`
 * - first value: default, could be removed
 * - not in `list`: incorrect
 *
 * @param  {Array} list
 * @return {function} a function(v) which returns a function to return
 * - value: string|null
 * - reason(k, v, result)
 */
function genEnumValidator(list) {
  return function ENUM_VALIDATOR(v, name) {
    v = (v || '').toString().trim()
    if (v.match(ID_REGEXP)) {
      return {value: v}
    }

    var index = list.indexOf(v)
    if (index > 0) {
      return {value: v}
    }
    if (index === 0) {
      return {
        value: v,
        reason: name !== 'objectFit' ?
          function reason(k, v, result) {
            return 'NOTE: Value `' + v + '` is the default value of the `' + util.camelCaseToHyphened(k) +
              '` attribute (the value can be removed).'
          } : null
      }
    }
    else {
      return {
        value: null,
        reason: function reason(k, v, result) {
          return 'ERROR: The `' + util.camelCaseToHyphened(k) + '` attribute does not support value `' + v +
            '` (the supported value is `' + list.join('`|`') + '`).'
        }
      }
    }
  }
}

var MASK_VALIDATOR = function MASK_VALIDATOR(v) {
  if (v.indexOf('url') >= 0) {
      return URL_VALIDATOR(v)
  } else {
      return BACKGROUND_VALIDATOR(v)
  }
}

var BACKGROUND_VALIDATOR = function BACKGROUND_VALIDATOR(v) {
  v = (v || '').toString().trim()
  if (v.indexOf('-gradient') > 0) {
    let valueMatch = v.match(/(repeating-linear|linear).*?(?=\s*(repeating|linear)|$)/g)
    let resultValues = {
      values: []
    }
    if (valueMatch && valueMatch.length) {
      let reasonMaps = []
      let length = 0
      valueMatch.forEach(function (realValue) {
        let temp, gradientValidator
        if(realValue.indexOf("-gradient") >= 0){
          temp = realValue.indexOf("repeating") >= 0 ? "repeatingLinearGradient": "linearGradient"
          gradientValidator = backgroundValidatorMap[temp]
        }
        if (typeof gradientValidator == 'function') {
          let validateResult = gradientValidator(realValue)
          if (util.isValidValue(validateResult.value)) {
            let jsonValue = JSON.parse(validateResult.value)
            resultValues.values.push(jsonValue)
          }
          let check = checkReason(validateResult, temp, realValue, length)
          length = check.length
          if (check.realReason !== null) {
            reasonMaps.push(check.realReason)
          }
        } else {
          length = 2
          reasonMaps.push("background type '" + realValue + "' is not supported.")
        }
      })
      return {
        value: length < 2 ? JSON.stringify(resultValues) : null,
        reason: reasonMaps.length > 0 ?
          function (k, v) {
            return logTypes[length] + ': Value `' + v + '` of the `' + util.camelCaseToHyphened(k) +
              '` attribute is incorrect. \n ' + reasonMaps.join(' \n ')
          } : null
      }
    }
  }
  return {
    value: null,
    reason: function (k, v) {
      return 'ERROR: The format of value `' + v + '` of the `' + util.camelCaseToHyphened(k) +
        '` attribute is incorrect.'
    }
  }
}

var LINEAR_GRADIENT_VALIDATOR = function LINEAR_GRADIENT_VALIDATOR(v) {
  v = (v || "").toString().trim()
  let result = {
    type: "",
    directions: ["to", "bottom"],
    values: []
  }
  let valueMatch = v.match(LINE_GRADIENT_ITEM_REGEXP)
  if (valueMatch) {
    let tempResult = {}
    let reasonMaps = []
    let length = 0
    let typeName = util.hyphenedToCamelCase(valueMatch[1])
    result.type = typeName
    let matchValues = valueMatch[2].split(/,/)
    if (LINE_GRADIENT_DIRECTION_REGEXP.test(matchValues[0])) {
      let directionValidator
      if (LINE_GRADIENT_TO_DIRECTION_REGEXP.test(matchValues[0])) {
        directionValidator = backgroundValidatorMap.linearGradientDirection
      } else if (matchValues[0].match(ANGLE_REGEXP)) {
        directionValidator = backgroundValidatorMap.linearGradientAngle
      }
      if (typeof directionValidator == "function") {
        tempResult = directionValidator(matchValues[0])
        if (util.isValidValue(tempResult.value)) {
          result.directions = tempResult.value.split(/\s+/)
        }
        let check = checkReason(tempResult, typeName, matchValues[0], length)
        length = check.length
        if (check.realReason !== null) {
          reasonMaps.push(check.realReason)
        }
        matchValues.splice(0, 1)
      }
    }
    if (matchValues.length > 0) {
      let colorStopResult = {}
      colorStopResult = backgroundValidatorMap.linearGradientColor(matchValues)
      if (util.isValidValue(colorStopResult.value)) {
        result.values = JSON.parse(colorStopResult.value)
      }
      let check = checkReason(colorStopResult, typeName, matchValues, length)
        length = check.length
        if (check.realReason !== null) {
          reasonMaps.push(check.realReason)
        }
    } else {
      length = 2
      reasonMaps.push("parameter '" + v + "' missing transition colors.")
    }
    return {
      value: length < 2 ? JSON.stringify(result) : null,
      reason: reasonMaps.length > 0 ?
        function (k, v) {
          return logTypes[length] + ': Value `' + v + '` of the `' + util.camelCaseToHyphened(k) +
            '` attribute is incorrect. \n  ' + reasonMaps.join('\n  ')
        }: null
    }
  }
  return {
    value: null,
    reason: function (k, v) {
      return 'ERROR: The format of value `' + v + '` of the `' + util.camelCaseToHyphened(k) +
        '` attribute is incorrect.'
    }
  }
}

var ARRAY_COLOR_STOP_VALIDATOR = function ARRAY_COLOR_STOP_VALIDATOR(v) {
  v = (v || '').toString().trim()
  let values = v.match(ARRAY_COLOR_STOP_REGEXP)
  if (values && values.length > 1) {
    let resultValues = []
    let reasonMaps = []
    let length = 0
    processValueItem(v, values, resultValues, reasonMaps, length)
    return {
      value: length < 2 ? JSON.stringify(resultValues) : null,
      reason: reasonMaps.length > 0 ?
        function (k, v) {
          return logTypes[length] + ': Value `' + v + '` of the `' +
            util.camelCaseToHyphened(k) + '` attribute is incorrect. \n  ' + reasonMaps.join('\n  ')
        } : null
    }
  }
  return {
    value: null,
    reason: function (k, v) {
      return 'ERROR: The format of value `' + v + '` of the `'+ util.camelCaseToHyphened(k) +
        '` attribute is incorrect. Please specify at least two colors.'
    }
  }
}

function processValueItem(v, values, resultValues, reasonMaps, length) {
  values.forEach(function (value, n) {
    let widthMatch = value.match(/[\s]+[-+0-9]+(px|%|vp|fp)?$/)
    let tempValues = []
    if (widthMatch) {
      let matchResult = PERCENTAGE_LENGTH_VALIDATOR(widthMatch[0])
      let index = value.indexOf(widthMatch[0])
      value = value.substring(0, index)
      if (util.isValidValue(matchResult.value)) {
        tempValues.push(matchResult.value)
      }
      let check = checkReason(matchResult, n.toString(), widthMatch[0], length)
      length = check.length
      if (check.realReason !== null) {
        reasonMaps.push(check.realReason)
      }
    }
    if (value) {
      let colorResult = COLOR_VAR_VALIDATOR(value)
      if (util.isValidValue(colorResult.value)) {
        tempValues.unshift(colorResult.value)
      }
      resultValues.push(tempValues.join(' '))
      let check = checkReason(colorResult, n.toString(), value, length)
      length = check.length
      if (check.realReason !== null) {
        reasonMaps.push(check.realReason)
      }
    } else {
      length = 2
      reasonMaps.push("parameter '" + v + "' is incorrect format.")
    }
  })
}

function checkReason(result, k, v, length) {
  let reason
  if (result.reason) {
    reason = result.reason(k, v, result.value)
    if (reason) {
      let reasonType = reason.match(/^([A-Z]+):/)
      let index
      if (reasonType) {
        index = logTypes.indexOf(reasonType[1])
        if (logTypes.indexOf(reasonType[1]) > length) {
          length = index
        }
        reason = reason.replace(reasonType[0], '').trim()
      }
    }
  }
  return {
    length: length,
    realReason: reason ? reason : null
  }
}

var ANGLE_VALIDATOR = function ANGLE_VALIDATOR(v) {
  v = (v || '').toString().trim()
  let match = v.match(ANGLE_REGEXP)
  if (match) {
    let unit = match[1]
    if (unit) {
      let angle = parseFloat(v)
      if (unit.toLowerCase() === 'rad') {
        return {
          value: Math.round(180 * angle / Math.PI) + SUPPORT_CSS_ANGLE_UNIT[0]
        }
      } else {
        if (SUPPORT_CSS_ANGLE_UNIT.indexOf(unit.toLowerCase()) >= 0) {
          return { value: v }
        } else {
          return {
            value: angle + SUPPORT_CSS_ANGLE_UNIT[0],
            reason: function(k, v) {
              return 'ERROR: The `' + util.camelCaseToHyphened(k) +
                '` attribute does not support `' + unit + '`. It only supports `' +
                JSON.stringify(SUPPORT_CSS_ANGLE_UNIT) + '`.'
            }
          }
        }
      }
    } else {
      return {
        value: parseFloat(v) + SUPPORT_CSS_ANGLE_UNIT[0],
        reason: function(k, v) {
          return 'WARNING: No unit is specified for the value `' + v +
            '` of the `' + util.camelCaseToHyphened(k) + '` attribute. The default unit is `' +
            SUPPORT_CSS_ANGLE_UNIT[0] + '`.'
        }
      }
    }
  }
  return {
    value: null,
    reason: function(k, v) {
      return 'ERROR: The `' + util.camelCaseToHyphened(k) + '` attribute does not support value `'
        + v + '` (only numbers are supported).'
    }
  }
}

var GRADIENT_DIRECTION_VALIDATOR = function GRADIENT_DIRECTION_VALIDATOR(v) {
  v = (v || "").toString().trim()
  let values = v.split(/\s+/)
  let invalid = false
  let scaleY = ['top','bottom']
  let scaleX = ['left','right']
  let valueOrder = []

  values.forEach(function (value) {
    if (value === 'to') {
      valueOrder.push(0)
    } else if (scaleY.includes(value)) {
      valueOrder.push(1)
    } else if (scaleX.includes(value)) {
      valueOrder.push(2)
    } else {
      invalid = true
    }
  })
  if (!invalid) {
    if (valueOrder[0] === 0 && valueOrder.length > 1 && valueOrder.length < 4 && valueOrder[1] !== 0) {
      if (valueOrder[2] && valueOrder[1] + valueOrder[2] !== 3) {
        invalid = true
      }
    }
  }

  return {
    value: invalid ? null : v,
    reason: invalid ?
      function (k, v) {
        return 'ERROR: The format of value `' + v + '` of the `' + util.camelCaseToHyphened(k) +
          '` attribute is incorrect.'
      } : null
  }
}

var URL_VALIDATOR = function URL_VALIDATOR(v) {
  v = (v || "").toString().trim()
  if (v.match(/^none$/i)) {
    return { value: "none" }
  }
  if (v.indexOf('@') >= 0) {
    let result
    // target format "@sys.media.sys_background_image" or '@sys.media.sys_background_image'
    let SysResourceTypeRefReg = /['"]\s*@sys\.media\.(?<resName>\w+)\s*['"]/
    result = SysResourceTypeRefReg.exec(v)
    if (result) {
      const resourceName = result.groups['resName']
      if (resourceName && OHOS_THEME_PROP_GROUPS[resourceName]) {
        return { value: "@sys.media." + OHOS_THEME_PROP_GROUPS[resourceName] }
      }
    }
    // target format "@app.media.customized_background_image" or '@app.media.customized_background_image'
    let AppResourceTypeRefReg = /['"]\s*@app\.media\.(?<resName>\w+)\s*['"]/
    result = AppResourceTypeRefReg.exec(v)
    if (result) {
      const resourceName = result.groups['resName']
      if (resourceName) {
        return { value: "@app.media." + resourceName}
      }
    }
  }

  let matchValues = URL_REGEXP.exec(v)
  if (matchValues) {
    if(isLiteDevice){
      return { value: matchValues[0] }
    }else{
      if (matchValues[1].match(/^\.\.\/|^\.\//)) {
        return {
          value: matchValues[1],
          isRelative: true
        }
      }
      else {
        return { value: matchValues[1] }
      }
    }
  }
  else {
    return {
      value: null,
      reason: function (k, v) {
          return 'ERROR: Value `' + v + '` of the `' + util.camelCaseToHyphened(k) +
            '` attribute must be none or url(...).'
      }
    }
  }
}

var NAME_VALIDATOR = function NAME_VALIDATOR(v) {
  v = (v || "").toString().trim()
  if (v.match(NAME_REGEXP)) {
    return  { value: v }
  } else {
    return {
      value: null,
      reason: function(k, v) {
        return 'ERROR: The format of value `' + v + '` of the `' +  util.camelCaseToHyphened(k) +
          '` attribute is incorrect.'
      }
    }
  }
}

var ITERATIONCOUNT_VALIDATOR = function ITERATIONCOUNT_VALIDATOR(v) {
  v = (v || "").toString().trim()
  if (v.match(INT_REGEXP)) {
    return {
      value: parseInt(v, 10)
    }
  } else if (v.match(/^infinite$/)) {
    return { value: -1 }
  } else {
    return {
      value: null,
      reason: function(k, v) {
          return 'ERROR: The format of value `' + v + '` of the `' +  util.camelCaseToHyphened(k) +
            '` attribute is incorrect (only integers and infinity are supported).'
      }
    }
  }
}

var BACKGROUND_SIZE_VALIDATOR = function BACKGROUND_SIZE_VALIDATOR(v) {
  v = (v || "").toString().trim()
  let values = v.split(/\s+/)
  const sizeReg = /auto|contain|cover/g
  if (values.length === 1) {
    if (/^(auto|contain|cover)$/.test(v)) {
      return { value: v }
    } else {
      return PERCENTAGE_LENGTH_VALIDATOR(v)
    }
  }
  if (values.length === 2 && !sizeReg.test(v)) {
    return SHORTHAND_VALIDATOR(v, PERCENTAGE_LENGTH_VALIDATOR)
  }
  return {
    value: null,
    reason: function(k, v) {
      return 'ERROR: Value `' + v + '` of the `' +  util.camelCaseToHyphened(k) + '` attribute is incorrect.'
    }
  }
}

var BACKGROUND_POSITION_VALIDATOR = function BACKGROUND_POSITION_VALIDATOR(v) {
  v = (v || '').toString().trim()
  let values = v.split(/\s+/)
  const positionReg = /left|right|top|bottom|center/g
  if (values.length === 1) {
    if (/^(left|right|top|bottom|center)$/.test(v)) {
      return { value: v }
    } else {
      return PERCENTAGE_LENGTH_VALIDATOR(v)
    }
  }
  if (values.length === 2) {
    if (!positionReg.test(v)) {
      return SHORTHAND_VALIDATOR(v, PERCENTAGE_LENGTH_VALIDATOR)
    } else {
      return CHECK_BACKGROUND_POSITION(v)
    }
  }
  return {
    value: null,
    reason: function(k, v) {
      return 'ERROR: Value `' + v + '` of the `' +  util.camelCaseToHyphened(k) + '` attribute is incorrect.'
    }
  }
}

var CHECK_BACKGROUND_POSITION = function CHECK_BACKGROUND_POSITION(v) {
  let values = v.split(/\s+/)
  let result = []
  let reasons = []
  let directions = []
  values.forEach(function(value, index) {
    if (/^(left|right|top|bottom|center)$/.test(value)) {
      result.push(value)
      if (checkDirection(value)) {
        directions.push(checkDirection(value))
      }
    } else {
      let tempResult = PERCENTAGE_LENGTH_VALIDATOR(value)
      if (tempResult.value) {
        result.push(value)
        if(index === 0){
          directions.push('horizon')
        } else {
          directions.push('vertical')
        }
      }
      if (tempResult.reason) {
        reasons.push(tempResult.reason)
      }
    }
  })
  if (directions.length === 2 && directions[0] === directions[1]) {
    reasons.push(function(k, v) {
      return 'ERROR: Value `' + v + '` of the `' + util.camelCaseToHyphened(k) + '` attribute is incorrect.'
    })
  }
  return {
    value: result.length > 0 ? result.join(' ') : null,
    reason: reasons.length > 0 ?
      function(k, v) {
        return reasons.map(function(res) {
          if (typeof res === 'function') {
            return res(k, v)
          }
        }).join('\n')
      }: null
  }
}

function checkDirection(v) {
  const scaleXReg = /^(left|right)$/
  const scaleYReg = /^(top|bottom)$/
  if (scaleXReg.test(v)) {
    return 'horizon'
  }
  if (scaleYReg.test(v)) {
    return 'vertical'
  }
  return null
}

var MYLOCATION_VALIDATOR = function MYLOCATION_VALIDATOR(v) {
  v = (v || "").toString().trim()
  let values = v.match(/\((.+?)\)/g) || []
  let replaceValue = null
  if (values.length) {
    for (let index = 0; index < values.length; index++) {
      replaceValue = values[index].replace(/\s*/g, "")
      v = v.replace(values[index], replaceValue);
    }
  }
  let realValues = v.split(/\s+/)
  let resultValues = []
  let valuesOrder = []
  let reason = null
  if (realValues && realValues.length <= 3) {
    realValues.forEach(function(realValue) {
      if (typeof COLOR_VAR_VALIDATOR(realValue).value == 'string') {
        resultValues.push(COLOR_VAR_VALIDATOR(realValue).value)
        valuesOrder.push(0)
      } else if (typeof URL_VALIDATOR(realValue).value == 'string') {
        resultValues.push(URL_VALIDATOR(realValue).value)
        valuesOrder.push(1)
      } else {
        reason = 'value'
      }
    })
    let n = -1
    valuesOrder.forEach(function(order) {
      if (order >= n) {
        n = order
      } else {
        if (!reason) {
          reason = 'order'
        }
      }
    })
    if (reason) {
      return {
        value : null,
        reason: function(k, v) {
          return reason == 'value' ?
            'ERROR: Value `' + v + '` of the `' + util.camelCaseToHyphened(k) +
            '` attribute does not meet the inspection standards for the color or url.' :
            'ERROR: Value `' + v + '` of the `' + util.camelCaseToHyphened(k) +
            '` attribute must be set in order(color color url).'
        }
      }
    }
    return {
      value: resultValues.join(" ")
    }
  }
  return {
    value: null,
    reason: function(k, v) {
      return 'ERROR: Value `' + v + '` of the `' + util.camelCaseToHyphened(k) + '` attribute is invalid.'
    }
  }
}

var TRANSFORM_ORIGIN_VALIDATOR = function TRANSFORM_ORIGIN_VALIDATOR(v) {
  v = (v || "").toString().trim()
  let values = v.split(/\s+/)
  const positionReg = /left|right|top|bottom|center/g
  if (values.length == 1) {
    if (/^(left|right|top|bottom|center)$/.test(v)) {
      return { value: v }
    } else {
      return PERCENTAGE_LENGTH_VALIDATOR(v);
    }
  }
  if (values.length == 2) {
    if (!positionReg.test(v)) {
      return SHORTHAND_VALIDATOR(v, PERCENTAGE_LENGTH_VALIDATOR)
    } else {
      return CHECK_TRANSFORM_ORIGIN(values)
    }
  }
  return {
    value: null,
    reason: function (k, v) {
      return 'ERROR: Value `' + v + '` of the `' + util.camelCaseToHyphened(k) +
        '` attribute is invalid. such as left 100px or 50% bottom.'
    }
  }
}

var CHECK_TRANSFORM_ORIGIN = function CHECK_TRANSFORM_ORIGIN(values) {
  let result = []
  let reasons = []
  let directions = []
  values.forEach(function (value, index) {
    if (/^(left|right|top|bottom|center)$/.test(value)) {
      result.push(value)
      directions.push(checkDirection(value))
    } else {
      let tempResult = PERCENTAGE_LENGTH_VALIDATOR(value)
      if (tempResult.value) {
        result.push(value)
        if (index === 0) {
          directions.push('horizon')
        } else {
          directions.push('vertical')
        }
      }
      if (tempResult.reason) {
        reasons.push(tempResult.reason)
      }
    }
  })
  if (directions.length != 2 || directions.length === 2 &&
    (directions[0] === 'vertical' || directions[1] === 'horizon')) {
    reasons.push(function (k, v) {
      return 'ERROR: Value `' + v + '` of the `' + util.camelCaseToHyphened(k) + '` attribute is incorrect.'
    })
  }
  return {
    value: result.length > 0 ? result.join(' ') : null,
    reason: reasons.length > 0 ?
      function (k, v) {
        return reasons.map(function (res) {
          if (typeof res === 'function') {
            return res(k, v)
          }
        }).join('\n')
      } : null
  }
}

var GRID_VALIDATOR = function GRID_VALIDATOR(v) {
  v = (v || '').toString().trim()
  if (v == 'auto' || v == 'auto-fill') {
    return { value: v }
  } else {
    return LENGTH(v, SUPPORT_CSS_GRID_UNIT)
  }
}

var GRID_TEMPLATE_VALIDATOR = function GRID_TEMPLATE_VALIDATOR(v) {
  v = (v || '').toString().trim()
  if (v.match(/^repeat/)) {
    let str = []
    if (v.match(/auto-fill/)) {
      let match = v.match(/^repeat\((.+),(.+)\)/)
      str.push(match[1].trim(), match[2].trim())
      return GRID_TEMPLATE_VALIDATOR(str.join(' '))
    } else {
      let match = v.match(/^repeat\((\d+),(.+)\)/)
      if (match[1] && match[2]) {
        let n = match[1]
          while (n > 0) {
            str.push(match[2].trim())
            n--
          }
        return GRID_TEMPLATE_VALIDATOR(str.join(' '))
      }
      else {
        return {
          value: null,
          reason: function reason(k, v, result) {
            return 'ERROR: The `' + util.camelCaseToHyphened(k) + '` attribute does not support value `' + v + '`.'
          }
        }
      }
    }
  }
  else {
    let value = []
    let reason = []
    let results = v.split(/\s+/).map(GRID_VALIDATOR)
    for (let i = 0; i < results.length; ++i) {
      let res = results[i]
      if (!res.value) {
        value = null
        reason = res.reason
        break
      }
      value.push(res.value)
      if (res.reason) {
        reason.push(res.reason)
      }
    }

    if (!value) {
      return {
        value: value,
        reason: reason
      }
    } else {
      return {
        value: value.join(' '),
        reason: reason.length > 0 ? function(k, v, result) {
          return reason.map(function (res) {
            if (typeof res === 'function') {
              return res(k, v, result)
            }
          }).join('\n')
        } : null
      }
    }
  }
}

var DATE_VALIDATOR = function DATE_VALIDATOR(v) {
  v = (v || '').toString().trim()
  if (DATE_REGEXP.test(v)) {
    return { value: v }
  } else {
    return {
      value: null,
      reason:function (k, v, result) {
        return 'ERROR: The format of value `' + v + '` of the `' +
          util.camelCaseToHyphened(k) + '` attribute is incorrect.'
      }
    }
  }
}

var FILTER_VALIDATOR = function FILTER_VALIDATOR(v) {
  v = (v || '').toString().trim().replace(/\s*/g, '')
  if (FILTER_REGEXP.test(v)) {
    return { value: v }
  } else {
    return {
      value: null,
      reason:function (k, v, result) {
        return 'ERROR: The format of value `' + v + '` of the `' +
          util.camelCaseToHyphened(k) + '` attribute is incorrect.'
      }
    }
  }
}

var FILTER_PERCENTAGE_VALIDATOR = function FILTER_PERCENTAGE_VALIDATOR(v) {
  v = (v || '').toString().trim().replace(/\s*,\s*/g, " ")
  if (FILTER_PERCENTAGE_REGEXP.test(v)) {
    return { value: v }
  }
  if (FILTER_STYLE_REGEXP.test(v)) {
    const values = v.trim().split(/\s+/)
    if(values[1] && values.length === 2){
      const blurStyleValidator = genEnumValidator(['small_light', 'medium_light', 'large_light',
        'xlarge_light', 'small_dark', 'medium_dark', 'large_dark', 'xlarge_dark'])
      const blurStyleResult = blurStyleValidator(values[1])
      if(util.isValidValue(blurStyleResult.value)){
        return { value: v }
      }
      let reasonMaps = [];
      let length = 0;
      let check = checkReason(blurStyleResult, 'window-filter', values[1], length)
      if(check.realReason !== null) {
        reasonMaps.push(check.realReason)
      }
      return {
        value: check.length < 2 ? JSON.stringify(blurStyleResult.value) : null,
        reason: function(k, v) {
          return 'ERROR: ' + reasonMaps
        }
      }
    }
  }
  return {
    value: null,
    reason:function (k, v, result) {
      return 'ERROR: The format of value `' + v + '` of the `' + util.camelCaseToHyphened(k) +
        '` attribute is incorrect.'
    }
  }
}

var BORDER_IMAGE_VALIDATOR = function BORDER_IMAGE_VALIDATOR(v) {
  var regexp = /(repeating-linear|linear).*?(?=\s*(repeating|linear)|$)/g;
  if (regexp.test(v)) {
    return BORDER_IMAGE_GRADIENT_VALIDATOR(v);
  } else {
    return BORDER_IMAGE_URL_VALIDATOR(v);
  }
}

var BORDER_IMAGE_URL_VALIDATOR = function BORDER_IMAGE_URL_VALIDATOR(v) {
  let base = {
    values: []
  };
  let value = {
    url: "",
    repeat: ""
  };
  var URL_REGEXP_FIRST = /^url\(\s*['"]?\s*([^()]+?)\s*['"]?\s*\)(.*)/;
  var regexpFirst = /(stretch|round|repeat|space)$/;
  var URL_REGEXP_SECOND = /^(.*)(stretch|round|repeat|space)$/;
  let result;
  result = URL_REGEXP_FIRST.exec(v);
  if (regexpFirst.test(result[2])) {
    let res = URL_REGEXP_SECOND.exec(result[2]);
    value = BORDER_IMAGE_NOL(res[1]);
    value.repeat = res[2];
  } else {
    var reg = /px|%/;
    if (reg.test(result[2])) {
      value = BORDER_IMAGE_NOL(result[2]);
    }
  }
  value.url = result[1];
  base.values.push(value);
  return {
    value: JSON.stringify(base)
  };
}

var BORDER_IMAGE_NOL = function BORDER_IMAGE_NOL(v) {
  let value = {
    url: "",
    repeat: ""
  };
  var reg = /px|%/;
  if (!reg.test(v)) {
    return value;
  }
  let num = v.split(/\//);
  switch (num.length) {
    case 1:
    value.slice = BORDER_IMAGE_SPLIT(num[0]);
    break;
    case 2:
    value.slice = BORDER_IMAGE_SPLIT(num[0]);
    value.width = BORDER_IMAGE_SPLIT(num[1]);
    break;
    case 3:
    value.slice = BORDER_IMAGE_SPLIT(num[0]);
    value.width = BORDER_IMAGE_SPLIT(num[1]);
    value.outset = BORDER_IMAGE_SPLIT(num[2]);
    break;
  }
  return value;
}

var BORDER_IMAGE_SPLIT = function BORDER_IMAGE_SPLIT(v) {
  const NUM_REGEXP = SHORTHAND_PERCENTAGE_LENGTH_VALIDATOR(v);
  let result = [];
  const value = NUM_REGEXP.value.split(/\s/);
  value.forEach(element => {
    result.push(element);
  });
  return result;
}

var BORDER_IMAGE_GRADIENT_VALIDATOR = function BORDER_IMAGE_GRADIENT_VALIDATOR(v) {
  v = (v || "").toString().trim()
  var BORDER_IMAGE_GRADIENT_ITEM_REGEXP = /^([0-9a-zA-Z-]+)\((.*)\)(.*)/;
  let base = {
    values: []
  }
  let valueMatch = v.match(BORDER_IMAGE_GRADIENT_ITEM_REGEXP)
  if (valueMatch) {
    const gradientStr = valueMatch[1].toString() + '(' + valueMatch[2].toString() + ')';
    const gradient = LINEAR_GRADIENT_VALIDATOR(gradientStr);
    let value = {};
    if (util.isValidValue(gradient.value)) {
      value = JSON.parse(gradient.value)
    }
    var reg = /px|%/;
    if (valueMatch[3].match(reg)) {
      value.slice = BORDER_IMAGE_SPLIT(valueMatch[3]);
    }
    base.values.push(value);
    return {
      value: JSON.stringify(base),
      reason: gradient.reason
    }
  }
  return {
    value: null,
    reason: function(k, v) {
      return 'ERROR: The format of value `' + v + '` of the `' + util.camelCaseToHyphened(k)
        + '` attribute is incorrect.'
    }
  }
}

var Color_Picker_VALIDATOR = function Color_Picker_VALIDATOR(v) {
  v = (v || "").toString().trim()
  let num = v.split(/\//);
  let base = {
    cValues: []
  }
  num.forEach(element => {
    base.cValues.push(COLOR_VAR_VALIDATOR(element).value);
  });
  return {
    value: JSON.stringify(base)
  }
}

var RICH_PROP_NAME_GROUPS = {
  boxModel: {
    width: PERCENTAGE_LENGTH_VALIDATOR,
    height: PERCENTAGE_LENGTH_VALIDATOR,
    overflow: genEnumValidator(['auto', 'hidden','scroll','visible']),
    padding: SHORTHAND_PERCENTAGE_LENGTH_VALIDATOR,
    paddingLeft: PERCENTAGE_LENGTH_VALIDATOR,
    paddingRight: PERCENTAGE_LENGTH_VALIDATOR,
    paddingTop: PERCENTAGE_LENGTH_VALIDATOR,
    paddingBottom: PERCENTAGE_LENGTH_VALIDATOR,
    paddingStart: PERCENTAGE_LENGTH_VALIDATOR,
    paddingEnd: PERCENTAGE_LENGTH_VALIDATOR,
    margin: SHORTHAND_AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    marginLeft: AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    marginRight: AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    marginTop: AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    marginBottom: AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    marginStart: PERCENTAGE_LENGTH_VALIDATOR,
    marginEnd: PERCENTAGE_LENGTH_VALIDATOR,
    placeholderColor: COLOR_VAR_VALIDATOR,
    selectedColor: COLOR_VAR_VALIDATOR,
    caretColor: COLOR_VAR_VALIDATOR,
    strokeWidth: LENGTH_VALIDATOR,
    progressColor: COLOR_VAR_VALIDATOR,
    slideWidth: LENGTH_VALIDATOR,
    slideMargin: LENGTH_VALIDATOR,
    resizeMode: genEnumValidator(['cover', 'contain', 'stretch', 'center']),
    columns: NUMBER_VALIDATOR,
    columnSpan: NUMBER_VALIDATOR,
    maskColor: COLOR_VAR_VALIDATOR,
    mylocation: MYLOCATION_VALIDATOR,
    mylocationFillColor: COLOR_VAR_VALIDATOR,
    mylocationStrokeColor: COLOR_VAR_VALIDATOR,
    mylocationIconPath: URL_VALIDATOR,
    displayIndex: NUMBER_VALIDATOR,
    aspectRatio: NUMBER_VALIDATOR,
    minWidth: PERCENTAGE_LENGTH_VALIDATOR,
    minHeight: PERCENTAGE_LENGTH_VALIDATOR,
    maxWidth: PERCENTAGE_LENGTH_VALIDATOR,
    maxHeight: PERCENTAGE_LENGTH_VALIDATOR,
    flexWeight: NUMBER_VALIDATOR,
    boxShadow: BOX_SHADOW_VALIDATOR,
    boxShadowH: LENGTH_VALIDATOR,
    boxShadowV: LENGTH_VALIDATOR,
    boxShadowBlur: LENGTH_VALIDATOR,
    boxShadowSpread: LENGTH_VALIDATOR,
    boxShadowColor: COLOR_VAR_VALIDATOR,
    filter: FILTER_VALIDATOR,
    backdropFilter: FILTER_VALIDATOR,
    windowFilter: FILTER_PERCENTAGE_VALIDATOR,
    transitionEffect: genEnumValidator(['unfold', 'none'])
  },
  div: {
    gridTemplateColumns: GRID_TEMPLATE_VALIDATOR,
    gridTemplateRows: GRID_TEMPLATE_VALIDATOR,
    gridGap: LENGTH_VALIDATOR,
    gridColumnsGap: LENGTH_VALIDATOR,
    gridRowsGap: LENGTH_VALIDATOR,
    gridRowStart: NUMBER_VALIDATOR,
    gridRowEnd: NUMBER_VALIDATOR,
    gridColumnStart: NUMBER_VALIDATOR,
    gridColumnEnd: NUMBER_VALIDATOR,
    gridAutoFlow: genEnumValidator(['row', 'column'])
  },
  border: {
    border: BORDER_VALIDATOR,
    borderWidth: SHORTHAND_LENGTH_VALIDATOR,
    borderLeftWidth: LENGTH_VALIDATOR,
    borderTopWidth: LENGTH_VALIDATOR,
    borderRightWidth: LENGTH_VALIDATOR,
    borderBottomWidth: LENGTH_VALIDATOR,
    borderColor: SHORTHAND_COLOR_VALIDATOR,
    borderLeftColor: COLOR_VAR_VALIDATOR,
    borderTopColor: COLOR_VAR_VALIDATOR,
    borderRightColor: COLOR_VAR_VALIDATOR,
    borderBottomColor: COLOR_VAR_VALIDATOR,
    borderStyle: SHORTHAND_STYLE_VALIDATOR,
    borderTopStyle: STYLE_VALIDATOR,
    borderRightStyle: STYLE_VALIDATOR,
    borderBottomStyle: STYLE_VALIDATOR,
    borderLeftStyle: STYLE_VALIDATOR,
    borderRadius: SHORTHAND_LENGTH_VALIDATOR,
    borderBottomLeftRadius: LENGTH_VALIDATOR,
    borderBottomRightRadius: LENGTH_VALIDATOR,
    borderTopLeftRadius: LENGTH_VALIDATOR,
    borderTopRightRadius: LENGTH_VALIDATOR,
    borderLeft: BORDER_VALIDATOR,
    borderRight: BORDER_VALIDATOR,
    borderTop: BORDER_VALIDATOR,
    borderBottom: BORDER_VALIDATOR,
    borderImage: BORDER_IMAGE_VALIDATOR,
    borderImageSource: URL_VALIDATOR,
    borderImageOutset: SHORTHAND_PERCENTAGE_LENGTH_VALIDATOR,
    borderImageSlice: SHORTHAND_PERCENTAGE_LENGTH_VALIDATOR,
    borderImageWidth: SHORTHAND_PERCENTAGE_LENGTH_VALIDATOR,
    borderImageRepeat: genEnumValidator(['stretch', 'round', 'repeat', 'space'])
  },
  indicator: {
    indicatorSize: LENGTH_VALIDATOR,
    indicatorTop: PERCENTAGE_LENGTH_VALIDATOR,
    indicatorRight: PERCENTAGE_LENGTH_VALIDATOR,
    indicatorBottom: PERCENTAGE_LENGTH_VALIDATOR,
    indicatorLeft: PERCENTAGE_LENGTH_VALIDATOR,
    indicatorColor: COLOR_VAR_VALIDATOR,
    indicatorSelectedColor: COLOR_VAR_VALIDATOR
  },
  animation: {
    animationDuration: TIME_VALIDATOR,
    animationDelay: TIME_VALIDATOR,
    animationName: NAME_VALIDATOR,
    animationTimingFunction: TRANSITION_TIMING_FUNCTION_VALIDATOR,
    animationIterationCount: ITERATIONCOUNT_VALIDATOR,
    animationFillMode: genEnumValidator(['none', 'forwards', 'backwards', 'both']),
    animationPlayState: genEnumValidator(['running', 'paused']),
    animationDirection: genEnumValidator(['normal', 'reverse', 'alternate', 'alternate-reverse']),
    animation: ANIMATION_VALIDATOR,
  },
  flexbox: {
    flex: genEnumValidator(['none', 'auto', 'initial']),
    flexWrap: genEnumValidator(['nowrap', 'wrap']),
    flexGrow: NUMBER_VALIDATOR,
    flexShrink: NUMBER_VALIDATOR,
    flexBasis: LENGTH_VALIDATOR,
    flexDirection: genEnumValidator(['row', 'column']),
    justifyContent: genEnumValidator(['flex-start', 'flex-end', 'center', 'space-between',
      'space-around', 'space-evenly']),
    alignItems: genEnumValidator(['stretch', 'flex-start', 'flex-end', 'center', 'baseline']),
    alignContent: genEnumValidator(['stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around']),
    alignSelf: genEnumValidator(["auto", "flex-start", "flex-end", "center", "baseline", "stretch"])
  },
  position: {
    position: genEnumValidator(['relative', 'fixed', 'absolute']),
    top: PERCENTAGE_LENGTH_VALIDATOR,
    bottom: PERCENTAGE_LENGTH_VALIDATOR,
    left: PERCENTAGE_LENGTH_VALIDATOR,
    right: PERCENTAGE_LENGTH_VALIDATOR,
    zIndex: INTEGER_VALIDATOR
  },
  common: {
    opacity: NUMBER_VALIDATOR,
    background: BACKGROUND_VALIDATOR,
    backgroundColor: COLOR_VAR_VALIDATOR,
    backgroundImage: URL_VALIDATOR,
    backgroundRepeat: genEnumValidator(['repeat', 'no-repeat', 'repeat-x', 'repeat-y']),
    visibility: genEnumValidator(['visible', 'hidden']),
    objectFit: genEnumValidator(['cover', 'fill', 'contain', 'none', 'scale-down']),
    backgroundSize: BACKGROUND_SIZE_VALIDATOR,
    backgroundPosition: BACKGROUND_POSITION_VALIDATOR,
    display: genEnumValidator(['flex', 'none', 'grid']),
    imageFill: COLOR_VAR_VALIDATOR,
    maskImage: MASK_VALIDATOR,
    maskPosition: BACKGROUND_POSITION_VALIDATOR,
    maskSize: BACKGROUND_SIZE_VALIDATOR
  },
  text: {
    lines: INTEGER_VALIDATOR,
    color: COLOR_VAR_VALIDATOR,
    fontSize: LENGTH_VALIDATOR,
    fontStyle: genEnumValidator(['normal', 'italic']),
    fontFamily: ANYTHING_VALIDATOR,
    fontWeight: genEnumValidator(['normal', 'lighter', 'bold', 'bolder', "medium", "regular",
      '100', '200', '300', '400', '500', '600', '700', '800', '900']),
    textDecoration: genEnumValidator(['none', 'underline', 'line-through']),
    textAlign: genEnumValidator(['start', 'end', 'left', 'center', 'right']),
    textOverflow: genEnumValidator(['clip', 'ellipsis']),
    textIndent: TEXT_INDENT_VALIDATOR,
    lineHeight: TEXT_LINE_HEIGHT_VALIDATOR,
    letterSpacing: LENGTH_VALIDATOR,
    minLines: NUMBER_VALIDATOR,
    maxLines: ANYTHING_VALIDATOR,
    minFontSize: LENGTH_VALIDATOR,
    maxFontSize: LENGTH_VALIDATOR,
    fontSizeStep: LENGTH_VALIDATOR,
    preferFontSizes: ARRAY_LENGTH_VALIDATOR,
    adaptHeight: genEnumValidator(['true', 'false']),
    allowScale: genEnumValidator(['true', 'false']),
    fontVariant: ANYTHING_VALIDATOR,
    id: ANYTHING_VALIDATOR,
    x: PERCENTAGE_LENGTH_VALIDATOR,
    y: PERCENTAGE_LENGTH_VALIDATOR,
    dx: PERCENTAGE_LENGTH_VALIDATOR,
    dy: PERCENTAGE_LENGTH_VALIDATOR,
    rotate: NUMBER_VALIDATOR,
    fill: COLOR_VAR_VALIDATOR,
    fillOpacity: NUMBER_VALIDATOR,
    stroke: COLOR_VAR_VALIDATOR,
    strokeOpacity: NUMBER_VALIDATOR,
    strokeWidth: LENGTH_VALIDATOR,
    fontFeatureSettings: ANYTHING_VALIDATOR
  },
  calendar: {
    boundaryColOffset: LENGTH_VALIDATOR,
    boundaryRowOffset: LENGTH_VALIDATOR,
    colSpace: LENGTH_VALIDATOR,
    dailyFiveRowSpace: LENGTH_VALIDATOR,
    dayColor: COLOR_VAR_VALIDATOR,
    dayFontSize: LENGTH_VALIDATOR,
    dayHeight: LENGTH_VALIDATOR,
    dayWidth: LENGTH_VALIDATOR,
    focusedAreaBackgroundColor: COLOR_VAR_VALIDATOR,
    focusedAreaRadius: LENGTH_VALIDATOR,
    focusedDayColor: COLOR_VAR_VALIDATOR,
    focusedLunarColor: COLOR_VAR_VALIDATOR,
    gregorianCalendarHeight: LENGTH_VALIDATOR,
    lunarColor: COLOR_VAR_VALIDATOR,
    lunarDayFontSize: LENGTH_VALIDATOR,
    lunarDayYAxisOffset: LENGTH_VALIDATOR,
    lunarHeight: LENGTH_VALIDATOR,
    markLunarColor: COLOR_VAR_VALIDATOR,
    nonCurrentMonthDayColor: COLOR_VAR_VALIDATOR,
    nonCurrentMonthLunarColor: COLOR_VAR_VALIDATOR,
    nonCurrentMonthOffDayMarkColor: COLOR_VAR_VALIDATOR,
    nonCurrentMonthWorkDayMarkColor: COLOR_VAR_VALIDATOR,
    offDayMarkColor: COLOR_VAR_VALIDATOR,
    offDayMarkSize: LENGTH_VALIDATOR,
    scheduleMarkerRadius: LENGTH_VALIDATOR,
    scheduleMarkerXAxisOffset: LENGTH_VALIDATOR,
    scheduleMarkerYAxisOffset: LENGTH_VALIDATOR,
    underscoreLength: LENGTH_VALIDATOR,
    underscoreWidth: LENGTH_VALIDATOR,
    underscoreXAxisOffset: LENGTH_VALIDATOR,
    underscoreYAxisOffset: LENGTH_VALIDATOR,
    weekAndDayRowSpace: LENGTH_VALIDATOR,
    weekColor: COLOR_VAR_VALIDATOR,
    weekFontSize: LENGTH_VALIDATOR,
    weekHeight: LENGTH_VALIDATOR,
    weekWidth: LENGTH_VALIDATOR,
    weekendDayColor: COLOR_VAR_VALIDATOR,
    weekendLunarColor: COLOR_VAR_VALIDATOR,
    workDayMarkColor: COLOR_VAR_VALIDATOR,
    workDayMarkSize: LENGTH_VALIDATOR,
    workStateHorizontalMovingDistance: LENGTH_VALIDATOR,
    workStateVerticalMovingDistance: LENGTH_VALIDATOR,
    workStateWidth: LENGTH_VALIDATOR
  },
  rating: {
    starBackground: URL_VALIDATOR,
    starForeground: URL_VALIDATOR,
    starSecondary: URL_VALIDATOR,
    rtlFlip: genEnumValidator(['true', 'false'])
  },
  transition: {
    transitionProperty: TRANSITION_PROPERTY_VALIDATOR,
    transitionDuration: TRANSITION_INTERVAL_VALIDATOR,
    transitionDelay: TRANSITION_INTERVAL_VALIDATOR,
    transitionEnter: NAME_VALIDATOR,
    transitionExit: NAME_VALIDATOR,
    transitionDuration: TIME_VALIDATOR,
    transitionTimingFunction: TRANSITION_TIMING_FUNCTION_VALIDATOR
  },
  transform: {
    transform: TRANSFORM_VALIDATOR,
    transformOrigin: TRANSFORM_ORIGIN_VALIDATOR
  },
  customized: {
    itemSize: LENGTH_VALIDATOR,
    itemColor: COLOR_VAR_VALIDATOR,
    itemSelectedColor: COLOR_VAR_VALIDATOR,
    textColor: COLOR_VAR_VALIDATOR,
    timeColor: COLOR_VAR_VALIDATOR,
    textHighlightColor: COLOR_VAR_VALIDATOR
  },
  list: {
    itemExtent: PERCENTAGE_LENGTH_VALIDATOR,
    fadeColor: COLOR_VAR_VALIDATOR,
    dividerColor: COLOR_VAR_VALIDATOR,
    dividerHeight: LENGTH_VALIDATOR,
    dividerLength: LENGTH_VALIDATOR,
    dividerOrigin: LENGTH_VALIDATOR,
    scrollbarColor: COLOR_VALIDATOR,
    scrollbarWidth: LENGTH_VALIDATOR,
    scrollbarOffset: ARRAY_LENGTH_VALIDATOR
  },
  progress: {
    secondaryColor: COLOR_VAR_VALIDATOR,
    scaleWidth: LENGTH_VALIDATOR,
    scaleNumber: NUMBER_VALIDATOR,
    startAngle: ANGLE_VALIDATOR,
    totalAngle: ANGLE_VALIDATOR,
    centerX: LENGTH_VALIDATOR,
    centerY: LENGTH_VALIDATOR,
    radius: LENGTH_VALIDATOR,
    direction: genEnumValidator(['start-to-end', 'end-to-start']),
    sections: NAME_VALIDATOR,
    colors: ARRAY_COLOR_VALIDATOR,
    weights: ARRAY_NUMBER_VALIDATOR
  },
  navigation: {
    titleColor: COLOR_VAR_VALIDATOR,
    subtitleColor: COLOR_VAR_VALIDATOR
  },
  button: {
    iconWidth: LENGTH_VALIDATOR,
    iconHeight: LENGTH_VALIDATOR
  },
  switch: {
    textonColor: COLOR_VAR_VALIDATOR,
    textoffColor: COLOR_VAR_VALIDATOR,
    textPadding: LENGTH_VALIDATOR
  },
  share: {
    sharedTransitionEffect: genEnumValidator(['exchange', 'static']),
    sharedTransitionName: NAME_VALIDATOR,
    sharedTransitionTimingFunction: TRANSITION_TIMING_FUNCTION_VALIDATOR
  },
  image: {
    matchTextDirection: genEnumValidator(['false', 'true']),
    fitOriginalSize: genEnumValidator(['false', 'true']),
  },
  divider: {
    lineCap: genEnumValidator(['butt', 'square', 'round'])
  },
  picker: {
    columnHeight: LENGTH_VALIDATOR
  },
  pickerView: {
    selectedFontSize: LENGTH_VALIDATOR,
    selectedFontFamily: ANYTHING_VALIDATOR,
    focusColor: COLOR_VAR_VALIDATOR,
    focusFontSize: LENGTH_VALIDATOR,
    focusFontFamily: ANYTHING_VALIDATOR,
    disappearFontSize: LENGTH_VALIDATOR,
    disappearColor: COLOR_VAR_VALIDATOR
  },
  colorpicker: {
    colorPickerColor: Color_Picker_VALIDATOR
  },
  colorpickerView: {
    colorPickerColor: Color_Picker_VALIDATOR
  },
  slider: {
    blockColor: COLOR_VAR_VALIDATOR,
  },
  badge: {
    badgeColor: COLOR_VAR_VALIDATOR,
    badgeSize: LENGTH_VALIDATOR
  },
  ellipse: {
    fill: COLOR_VAR_VALIDATOR,
    fillOpacity: NUMBER_VALIDATOR,
    fillRule: genEnumValidator(['nonzero', 'evenodd']),
    opacity: NUMBER_VALIDATOR,
    stroke: COLOR_VAR_VALIDATOR,
    strokeDasharray: ANYTHING_VALIDATOR,
    strokeDashoffset: LENGTH_VALIDATOR,
    strokeLinejoin: genEnumValidator(['bevel', 'miter', 'round']),
    strokeLinecap: genEnumValidator(['butt', 'round', 'square']),
    strokeMiterlimit: NUMBER_VALIDATOR,
    strokeOpacity: NUMBER_VALIDATOR,
    strokeWidth: LENGTH_VALIDATOR,
    transform: TRANSFORM_VALIDATOR,
    id: ANYTHING_VALIDATOR,
    cx: PERCENTAGE_LENGTH_VALIDATOR,
    cy: PERCENTAGE_LENGTH_VALIDATOR,
    rx: PERCENTAGE_LENGTH_VALIDATOR,
    ry: PERCENTAGE_LENGTH_VALIDATOR
  },
  rect: {
    id: ANYTHING_VALIDATOR,
    fill: COLOR_VAR_VALIDATOR,
    fillOpacity: NUMBER_VALIDATOR,
    fillRule: genEnumValidator(['nonzero', 'evenodd']),
    opacity: NUMBER_VALIDATOR,
    strokeDasharray: ANYTHING_VALIDATOR,
    strokeLinejoin: genEnumValidator(['bevel', 'miter', 'round']),
    strokeLinecap: genEnumValidator(['butt', 'round', 'square']),
    strokeMiterlimit: NUMBER_VALIDATOR,
    strokeOpacity: NUMBER_VALIDATOR,
    strokeWidth: LENGTH_VALIDATOR,
    transform: TRANSFORM_VALIDATOR,
    width: PERCENTAGE_LENGTH_VALIDATOR,
    height: PERCENTAGE_LENGTH_VALIDATOR,
    x: PERCENTAGE_LENGTH_VALIDATOR,
    y: PERCENTAGE_LENGTH_VALIDATOR,
    rx: PERCENTAGE_LENGTH_VALIDATOR,
    ry: PERCENTAGE_LENGTH_VALIDATOR,
    stroke: COLOR_VAR_VALIDATOR,
    strokeDashoffset: LENGTH_VALIDATOR
  },
  circle: {
    fill: COLOR_VAR_VALIDATOR,
    fillOpacity: NUMBER_VALIDATOR,
    fillRule: genEnumValidator(['nonzero', 'evenodd']),
    opacity: NUMBER_VALIDATOR,
    stroke: COLOR_VAR_VALIDATOR,
    strokeDasharray: ANYTHING_VALIDATOR,
    strokeDashoffset: LENGTH_VALIDATOR,
    strokeLinejoin: genEnumValidator(['bevel', 'miter', 'round']),
    strokeLinecap: genEnumValidator(['butt', 'round', 'square']),
    strokeMiterlimit: NUMBER_VALIDATOR,
    strokeOpacity: NUMBER_VALIDATOR,
    strokeWidth: LENGTH_VALIDATOR,
    transform: TRANSFORM_VALIDATOR,
    id: ANYTHING_VALIDATOR,
    cx: PERCENTAGE_LENGTH_VALIDATOR,
    cy: PERCENTAGE_LENGTH_VALIDATOR,
    r: PERCENTAGE_LENGTH_VALIDATOR
  },
  path: {
    fillOpacity: NUMBER_VALIDATOR,
    fillRule: genEnumValidator(['nonzero', 'evenodd']),
    opacity: NUMBER_VALIDATOR,
    strokeDashoffset: LENGTH_VALIDATOR,
    strokeLinejoin: genEnumValidator(['bevel', 'miter', 'round']),
    strokeLinecap: genEnumValidator(['butt', 'round', 'square']),
    strokeMiterlimit: NUMBER_VALIDATOR,
    strokeOpacity: NUMBER_VALIDATOR,
    strokeWidth: LENGTH_VALIDATOR,
    transform: TRANSFORM_VALIDATOR,
    id: ANYTHING_VALIDATOR,
    d: ANYTHING_VALIDATOR,
    fill: COLOR_VAR_VALIDATOR,
    strokeDasharray: ANYTHING_VALIDATOR,
    stroke: COLOR_VAR_VALIDATOR
  },
  svg: {
    fill: COLOR_VAR_VALIDATOR,
    fillOpacity: NUMBER_VALIDATOR,
    fillRule: genEnumValidator(['nonzero', 'evenodd']),
    opacity: NUMBER_VALIDATOR,
    stroke: COLOR_VAR_VALIDATOR,
    strokeDasharray: ANYTHING_VALIDATOR,
    strokeDashoffset: LENGTH_VALIDATOR,
    strokeLinejoin: genEnumValidator(['bevel', 'miter', 'round']),
    strokeLinecap: genEnumValidator(['butt', 'round', 'square']),
    strokeMiterlimit: NUMBER_VALIDATOR,
    strokeOpacity: NUMBER_VALIDATOR,
    strokeWidth: LENGTH_VALIDATOR,
    transform: TRANSFORM_VALIDATOR,
    id: ANYTHING_VALIDATOR,
    width: PERCENTAGE_LENGTH_VALIDATOR,
    height: PERCENTAGE_LENGTH_VALIDATOR,
    x: PERCENTAGE_LENGTH_VALIDATOR,
    y: PERCENTAGE_LENGTH_VALIDATOR,
    viewbox: ANYTHING_VALIDATOR
  },
  polygon: {
    fill: COLOR_VAR_VALIDATOR,
    fillOpacity: NUMBER_VALIDATOR,
    opacity: NUMBER_VALIDATOR,
    stroke: COLOR_VAR_VALIDATOR,
    strokeDasharray: ANYTHING_VALIDATOR,
    strokeDashoffset: LENGTH_VALIDATOR,
    strokeLinejoin: genEnumValidator(['bevel', 'miter', 'round']),
    strokeLinecap: genEnumValidator(['butt', 'round', 'square']),
    strokeMiterlimit: NUMBER_VALIDATOR,
    strokeOpacity: NUMBER_VALIDATOR,
    strokeWidth: LENGTH_VALIDATOR,
    transform: TRANSFORM_VALIDATOR,
    id: ANYTHING_VALIDATOR,
    points: ANYTHING_VALIDATOR,
    fillRule: genEnumValidator(['nonzero', 'evenodd'])
  },
  polyline: {
    fill: COLOR_VAR_VALIDATOR,
    fillOpacity: NUMBER_VALIDATOR,
    opacity: NUMBER_VALIDATOR,
    stroke: COLOR_VAR_VALIDATOR,
    strokeDasharray: ANYTHING_VALIDATOR,
    strokeDashoffset: LENGTH_VALIDATOR,
    strokeLinejoin: genEnumValidator(['bevel', 'miter', 'round']),
    strokeLinecap: genEnumValidator(['butt', 'round', 'square']),
    strokeMiterlimit: NUMBER_VALIDATOR,
    strokeOpacity: NUMBER_VALIDATOR,
    strokeWidth: LENGTH_VALIDATOR,
    transform: TRANSFORM_VALIDATOR,
    id: ANYTHING_VALIDATOR,
    points: ANYTHING_VALIDATOR,
    fillRule: genEnumValidator(['nonzero', 'evenodd'])
  },
  tspan: {
    id: ANYTHING_VALIDATOR,
    x: PERCENTAGE_LENGTH_VALIDATOR,
    y: PERCENTAGE_LENGTH_VALIDATOR,
    dx: PERCENTAGE_LENGTH_VALIDATOR,
    dy: PERCENTAGE_LENGTH_VALIDATOR,
    rotate: NUMBER_VALIDATOR,
    fontSize: LENGTH_VALIDATOR,
    fill: COLOR_VAR_VALIDATOR,
    fillOpacity: NUMBER_VALIDATOR,
    stroke: COLOR_VAR_VALIDATOR,
    strokeOpacity: NUMBER_VALIDATOR,
    strokeWidth: LENGTH_VALIDATOR
  },
  textPath: {
    id: ANYTHING_VALIDATOR,
    path: ANYTHING_VALIDATOR,
    startOffset: PERCENTAGE_LENGTH_VALIDATOR,
    fontSize: LENGTH_VALIDATOR,
    fill: COLOR_VAR_VALIDATOR,
    fillOpacity: NUMBER_VALIDATOR,
    stroke: COLOR_VAR_VALIDATOR,
    strokeOpacity: NUMBER_VALIDATOR,
    strokeWidth: LENGTH_VALIDATOR
  },
  animate: {
    id: ANYTHING_VALIDATOR,
    attributeName: ANYTHING_VALIDATOR,
    begin: ANYTHING_VALIDATOR,
    dur: ANYTHING_VALIDATOR,
    end: ANYTHING_VALIDATOR,
    repeatCount: ANYTHING_VALIDATOR,
    fill: genEnumValidator(['freeze', 'remove']),
    calcMode: genEnumValidator(['discrete', 'linear', 'paced', 'spline']),
    keyTimes: ANYTHING_VALIDATOR,
    keySplines: ANYTHING_VALIDATOR,
    from: ANYTHING_VALIDATOR,
    to: ANYTHING_VALIDATOR,
    values: ANYTHING_VALIDATOR
  },
  animateMotion: {
    id: ANYTHING_VALIDATOR,
    attributeName: ANYTHING_VALIDATOR,
    begin: ANYTHING_VALIDATOR,
    dur: ANYTHING_VALIDATOR,
    end: ANYTHING_VALIDATOR,
    repeatCount: ANYTHING_VALIDATOR,
    fill: genEnumValidator(['freeze', 'remove']),
    calcMode: genEnumValidator(['discrete', 'linear', 'paced', 'spline']),
    keyTimes: ANYTHING_VALIDATOR,
    keySplines: ANYTHING_VALIDATOR,
    from: ANYTHING_VALIDATOR,
    to: ANYTHING_VALIDATOR,
    keyPoints: ANYTHING_VALIDATOR,
    path: ANYTHING_VALIDATOR,
    rotate: ANYTHING_VALIDATOR
  },
  animateTransform: {
    id: ANYTHING_VALIDATOR,
    attributeName: ANYTHING_VALIDATOR,
    begin: ANYTHING_VALIDATOR,
    dur: ANYTHING_VALIDATOR,
    end: ANYTHING_VALIDATOR,
    repeatCount: ANYTHING_VALIDATOR,
    fill: genEnumValidator(['freeze', 'remove']),
    calcMode: genEnumValidator(['discrete', 'linear', 'paced', 'spline']),
    from: ANYTHING_VALIDATOR,
    to: ANYTHING_VALIDATOR,
    type: genEnumValidator(['translate', 'scale', 'skewX', 'skewY'])
  },
  line: {
    fill: COLOR_VAR_VALIDATOR,
    fillOpacity: NUMBER_VALIDATOR,
    opacity: NUMBER_VALIDATOR,
    stroke: COLOR_VAR_VALIDATOR,
    strokeDasharray: ANYTHING_VALIDATOR,
    strokeDashoffset: LENGTH_VALIDATOR,
    strokeLinejoin: genEnumValidator(['bevel', 'miter', 'round']),
    strokeLinecap: genEnumValidator(['butt', 'round', 'square']),
    strokeMiterlimit: NUMBER_VALIDATOR,
    strokeOpacity: NUMBER_VALIDATOR,
    strokeWidth: LENGTH_VALIDATOR,
    fillRule: genEnumValidator(['nonzero', 'evenodd']),
    transform: TRANSFORM_VALIDATOR,
    id: ANYTHING_VALIDATOR,
    x1: PERCENTAGE_LENGTH_VALIDATOR,
    y1: PERCENTAGE_LENGTH_VALIDATOR,
    x2: PERCENTAGE_LENGTH_VALIDATOR,
    y2: PERCENTAGE_LENGTH_VALIDATOR
  }
}

var LITE_PROP_NAME_GROUPS = {
  boxModel: {
    width: PERCENTAGE_LENGTH_VALIDATOR,
    height: PERCENTAGE_LENGTH_VALIDATOR,
    padding: SHORTHAND_LENGTH_VALIDATOR,
    paddingLeft: LENGTH_VALIDATOR,
    paddingRight: LENGTH_VALIDATOR,
    paddingTop: LENGTH_VALIDATOR,
    paddingBottom: LENGTH_VALIDATOR,
    margin:SHORTHAND_AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    marginLeft: AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    marginRight: AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    marginTop: AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    marginBottom: AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    strokeWidth: LENGTH_VALIDATOR,
  },
  border:{
    borderWidth: SHORTHAND_LENGTH_VALIDATOR,
    borderColor: SHORTHAND_COLOR_VALIDATOR,
    borderRadius: LENGTH_VALIDATOR,
  },
  animation:{
    animationDuration: TIME_VALIDATOR,
    animationDelay: TIME_VALIDATOR,
    animationName: NAME_VALIDATOR,
    animationTimingFunction: genEnumValidator(['linear', 'ease-in', 'ease-out', 'ease-in-out']),
    animationIterationCount: ITERATIONCOUNT_VALIDATOR,
    animationFillMode: genEnumValidator(['none', 'forwards'])
  },
  flexbox: {
    flexDirection: genEnumValidator(['row', 'column']),
    flexWrap: genEnumValidator(['nowrap', 'wrap']),
    justifyContent: genEnumValidator(['flex-start', 'flex-end', 'center', 'space-between',
      'space-around', 'space-evenly']),
    alignItems: genEnumValidator(['stretch', 'flex-start', 'flex-end', 'center']),
  },
  position: {
    top: PERCENTAGE_LENGTH_VALIDATOR,
    left: PERCENTAGE_LENGTH_VALIDATOR,
  },
  common: {
    opacity: NUMBER_VALIDATOR,
    backgroundColor: COLOR_VAR_VALIDATOR,
    backgroundImage: URL_VALIDATOR,
    placeholderColor: COLOR_VAR_VALIDATOR,
    display: genEnumValidator(['flex', 'none']),
  },
  text: {
    color: COLOR_VAR_VALIDATOR,
    fontSize: LENGTH_VALIDATOR,
    fontFamily: genEnumValidator(['HYQiHei-65S']),
    letterSpacing: LENGTH_VALIDATOR,
    textAlign: genEnumValidator(['left', 'center', 'right']),
    textOverflow: genEnumValidator(['clip', 'ellipsis']),
  },
  slider: {
    selectedColor: COLOR_VAR_VALIDATOR,
    selectedFontSize: LENGTH_VALIDATOR,
    selectedFontFamily: genEnumValidator(['HYQiHei-65S']),
    blockColor: COLOR_VAR_VALIDATOR,
  },
  transform: {
    transform: TRANSFORM_VALIDATOR,
  },
  progress: {
    centerX: LENGTH_VALIDATOR,
    centerY: LENGTH_VALIDATOR,
    radius: LENGTH_VALIDATOR,
    startAngle: ANGLE_VALIDATOR,
    totalAngle: ANGLE_VALIDATOR
  }
}

var CARD_PROP_NAME_GROUPS = {
  boxModel: {
    width: PERCENTAGE_LENGTH_VALIDATOR,
    height: PERCENTAGE_LENGTH_VALIDATOR,
    overflow: genEnumValidator(['auto', 'hidden','scroll','visible']),
    padding: SHORTHAND_PERCENTAGE_LENGTH_VALIDATOR,
    paddingLeft: PERCENTAGE_LENGTH_VALIDATOR,
    paddingRight: PERCENTAGE_LENGTH_VALIDATOR,
    paddingTop: PERCENTAGE_LENGTH_VALIDATOR,
    paddingBottom: PERCENTAGE_LENGTH_VALIDATOR,
    paddingStart: PERCENTAGE_LENGTH_VALIDATOR,
    paddingEnd: PERCENTAGE_LENGTH_VALIDATOR,
    margin: SHORTHAND_AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    marginLeft: AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    marginRight: AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    marginTop: AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    marginBottom: AUTO_PERCENTAGE_LENGTH_VALIDATOR,
    marginStart: PERCENTAGE_LENGTH_VALIDATOR,
    marginEnd: PERCENTAGE_LENGTH_VALIDATOR,
    columns: NUMBER_VALIDATOR,
    displayIndex: NUMBER_VALIDATOR,
    aspectRatio: NUMBER_VALIDATOR,
    minWidth: PERCENTAGE_LENGTH_VALIDATOR,
    minHeight: PERCENTAGE_LENGTH_VALIDATOR,
    maxWidth: PERCENTAGE_LENGTH_VALIDATOR,
    maxHeight: PERCENTAGE_LENGTH_VALIDATOR,
    flexWeight: NUMBER_VALIDATOR,
    boxShadow: BOX_SHADOW_VALIDATOR,
    boxShadowH: LENGTH_VALIDATOR,
    boxShadowV: LENGTH_VALIDATOR,
    boxShadowBlur: LENGTH_VALIDATOR,
    boxShadowSpread: LENGTH_VALIDATOR,
    boxShadowColor: COLOR_VAR_VALIDATOR,
    filter: FILTER_VALIDATOR,
    backdropFilter: FILTER_VALIDATOR,
    windowFilter: FILTER_PERCENTAGE_VALIDATOR
  },
  div: {
    gridTemplateColumns: GRID_TEMPLATE_VALIDATOR,
    gridTemplateRows: GRID_TEMPLATE_VALIDATOR,
    gridGap: LENGTH_VALIDATOR,
    gridColumnsGap: LENGTH_VALIDATOR,
    gridRowsGap: LENGTH_VALIDATOR,
    gridRowStart: NUMBER_VALIDATOR,
    gridRowEnd: NUMBER_VALIDATOR,
    gridColumnStart: NUMBER_VALIDATOR,
    gridColumnEnd: NUMBER_VALIDATOR
  },
  border: {
    border: BORDER_VALIDATOR,
    borderWidth: SHORTHAND_LENGTH_VALIDATOR,
    borderLeftWidth: LENGTH_VALIDATOR,
    borderTopWidth: LENGTH_VALIDATOR,
    borderRightWidth: LENGTH_VALIDATOR,
    borderBottomWidth: LENGTH_VALIDATOR,
    borderColor: SHORTHAND_COLOR_VALIDATOR,
    borderLeftColor: COLOR_VAR_VALIDATOR,
    borderTopColor: COLOR_VAR_VALIDATOR,
    borderRightColor: COLOR_VAR_VALIDATOR,
    borderBottomColor: COLOR_VAR_VALIDATOR,
    borderStyle: genEnumValidator(['solid', 'dashed', 'dotted']),
    borderTopStyle: genEnumValidator(['solid', 'dashed', 'dotted']),
    borderRightStyle: genEnumValidator(['solid', 'dashed', 'dotted']),
    borderBottomStyle: genEnumValidator(['solid', 'dashed', 'dotted']),
    borderLeftStyle: genEnumValidator(['solid', 'dashed', 'dotted']),
    borderRadius: LENGTH_VALIDATOR,
    borderBottomLeftRadius: LENGTH_VALIDATOR,
    borderBottomRightRadius: LENGTH_VALIDATOR,
    borderTopLeftRadius: LENGTH_VALIDATOR,
    borderTopRightRadius: LENGTH_VALIDATOR,
    borderLeft: BORDER_VALIDATOR,
    borderRight: BORDER_VALIDATOR,
    borderTop: BORDER_VALIDATOR,
    borderBottom: BORDER_VALIDATOR
  },
  flexbox: {
    flex: genEnumValidator(['none', 'auto', 'initial']),
    flexWrap: genEnumValidator(['nowrap', 'wrap']),
    flexGrow: NUMBER_VALIDATOR,
    flexShrink: NUMBER_VALIDATOR,
    flexBasis: LENGTH_VALIDATOR,
    flexDirection: genEnumValidator(['row', 'column']),
    justifyContent: genEnumValidator(['flex-start', 'flex-end', 'center', 'space-between',
      'space-around', 'space-evenly']),
    alignItems: genEnumValidator(['stretch', 'flex-start', 'flex-end', 'center', 'baseline']),
    alignContent: genEnumValidator(['stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around']),
  },
  position: {
    position: genEnumValidator(['relative', 'fixed', 'absolute']),
    top: PERCENTAGE_LENGTH_VALIDATOR,
    bottom: PERCENTAGE_LENGTH_VALIDATOR,
    left: PERCENTAGE_LENGTH_VALIDATOR,
    right: PERCENTAGE_LENGTH_VALIDATOR,
    zIndex: INTEGER_VALIDATOR
  },
  common: {
    background: BACKGROUND_VALIDATOR,
    backgroundColor: COLOR_VAR_VALIDATOR,
    backgroundImage: URL_VALIDATOR,
    backgroundSize: BACKGROUND_SIZE_VALIDATOR,
    backgroundRepeat: genEnumValidator(['repeat', 'no-repeat', 'repeat-x', 'repeat-y']),
    backgroundPosition: BACKGROUND_POSITION_VALIDATOR,
    opacity: NUMBER_VALIDATOR,
    appearingDuration: NUMBER_VALIDATOR,
    visibility: genEnumValidator(['visible', 'hidden']),
    display: genEnumValidator(['flex', 'none', 'grid']),
    imageFill: COLOR_VAR_VALIDATOR,
    maskImage: MASK_VALIDATOR,
    maskPosition: BACKGROUND_POSITION_VALIDATOR,
    maskSize: BACKGROUND_SIZE_VALIDATOR
  },
  text: {
    color: COLOR_VAR_VALIDATOR,
    fontSize: LENGTH_VALIDATOR,
    allowScale: genEnumValidator(['true', 'false']),
    letterSpacing: LENGTH_VALIDATOR,
    fontStyle: genEnumValidator(['normal', 'italic']),
    fontFamily: ANYTHING_VALIDATOR,
    fontWeight: genEnumValidator(['normal', 'lighter', 'bold', 'bolder', "medium", "regular",
      '100', '200', '300', '400', '500', '600', '700', '800', '900']),
    textDecoration: genEnumValidator(['none', 'underline', 'line-through']),
    textAlign: genEnumValidator(['start', 'end', 'left', 'center', 'right']),
    textOverflow: genEnumValidator(['clip', 'ellipsis']),
    textIndent: TEXT_INDENT_VALIDATOR,
    lineHeight: LENGTH_VALIDATOR,
    maxLines: ANYTHING_VALIDATOR,
    minFontSize: LENGTH_VALIDATOR,
    maxFontSize: LENGTH_VALIDATOR,
    fontSizeStep: LENGTH_VALIDATOR,
    preferFontSizes: ARRAY_LENGTH_VALIDATOR,
    adaptHeight: genEnumValidator(['true', 'false'])
  },
  progress: {
    secondaryColor: COLOR_VAR_VALIDATOR,
    scaleWidth: LENGTH_VALIDATOR,
    scaleNumber: NUMBER_VALIDATOR,
    startAngle: ANGLE_VALIDATOR,
    totalAngle: ANGLE_VALIDATOR,
    centerX: LENGTH_VALIDATOR,
    centerY: LENGTH_VALIDATOR,
    radius: LENGTH_VALIDATOR,
    direction: genEnumValidator(['start-to-end', 'end-to-start']),
    sections: NAME_VALIDATOR,
    colors: ARRAY_COLOR_VALIDATOR,
    weights: ARRAY_NUMBER_VALIDATOR
  },
  chart: {
    strokeWidth: LENGTH_VALIDATOR,
  },
  button: {
    textColor: COLOR_VAR_VALIDATOR,
    iconWidth: LENGTH_VALIDATOR,
    iconHeight: LENGTH_VALIDATOR
  },
  image: {
    objectFit: genEnumValidator(['cover', 'fill', 'contain', 'none', 'scale-down']),
    matchTextDirection: genEnumValidator(['false', 'true']),
    fitOriginalSize: genEnumValidator(['false', 'true']),
  },
  list: {
    itemExtent: PERCENTAGE_LENGTH_VALIDATOR,
    fadeColor: COLOR_VAR_VALIDATOR,
    dividerColor: COLOR_VAR_VALIDATOR,
    dividerHeight: LENGTH_VALIDATOR,
    dividerLength: LENGTH_VALIDATOR,
    dividerOrigin: LENGTH_VALIDATOR,
    scrollbarColor: COLOR_VALIDATOR,
    scrollbarWidth: LENGTH_VALIDATOR,
    scrollbarOffset: ARRAY_LENGTH_VALIDATOR
  }
}

var backgroundValidatorMap = {
  linearGradient: LINEAR_GRADIENT_VALIDATOR,
  repeatingLinearGradient: LINEAR_GRADIENT_VALIDATOR,
  linearGradientColor: ARRAY_COLOR_STOP_VALIDATOR,
  linearGradientAngle: ANGLE_VALIDATOR,
  linearGradientDirection: GRADIENT_DIRECTION_VALIDATOR
}

var transformValidatorMap = {
  translate: MULTIPLE_PERCENTAGE_LENGTH_VALIDATOR,
  translate3d: MULTIPLE_PERCENTAGE_LENGTH_VALIDATOR,
  translateX: PERCENTAGE_LENGTH_VALIDATOR,
  translateY: PERCENTAGE_LENGTH_VALIDATOR,
  translateZ: PERCENTAGE_LENGTH_VALIDATOR,
  scale: MULTIPLE_NUMBER_VALIDATOR,
  scale3d: MULTIPLE_NUMBER_VALIDATOR,
  scaleX: NUMBER_VALIDATOR,
  scaleY: NUMBER_VALIDATOR,
  scaleZ: NUMBER_VALIDATOR,
  rotate: MUTIPLE_ANGLE_VALIDATOR,
  rotate3d: ROTATE3D_VALIDATOR,
  rotateX: ANGLE_VALIDATOR,
  rotateY: ANGLE_VALIDATOR,
  rotateZ: ANGLE_VALIDATOR,
  skew: MUTIPLE_ANGLE_VALIDATOR,
  skewX: ANGLE_VALIDATOR,
  skewY: ANGLE_VALIDATOR,
  matrix: MULTIPLE_NUMBER_VALIDATOR,
  matrix3d: MULTIPLE_NUMBER_VALIDATOR,
  perspective: PERCENTAGE_LENGTH_VALIDATOR,
}

var SUGGESTED_PROP_NAME_GROUP = {}

var validatorMap = {}

const card = process.env.DEVICE_LEVEL === 'card'
var isLiteDevice = process.env.DEVICE_LEVEL === 'lite'

var PROP_NAME_GROUPS = process.env.DEVICE_LEVEL === 'lite' ? LITE_PROP_NAME_GROUPS :
  card ? CARD_PROP_NAME_GROUPS : RICH_PROP_NAME_GROUPS

/**
 * flatten `PROP_NAME_GROUPS` to `validatorMap`
 */
function genValidatorMap() {
  var groupName, group, name
  for (groupName in PROP_NAME_GROUPS) {
    group = PROP_NAME_GROUPS[groupName]
    for (name in group) {
      validatorMap[name] = group[name]
    }
  }
}

genValidatorMap()

function getValueUnit(dem) {
  var str = dem.toString()
  var getValue = str.match(/[-]{0,1}[1-9][0-9]*/)
  var getUnit = str.match(/px|cm|%|em|vp|fp/)
  var result = {value: getValue, unit: getUnit}
  return result
}

function isOperator(value) {
  var operatorString = "+-*/()"
  return operatorString.indexOf(value) > -1
}

function getPrioraty(value) {
  switch(value) {
    case '+':
    case '-':
      return 1
    case '*':
    case '/':
      return 2
    default:
      return 0
  }
}

function prioraty(o1, o2) {
  return getPrioraty(o1) <= getPrioraty(o2)
}

function dal2Rpn(exp) {
  var inputStack = []
  var outputStack = []
  var outputQueue = []
  var str =
    exp.replace(/calc/g, "").replace(/(?<!var\(\-\-\w+|var\(\-\-\w+\,\s*\w+)\)/g, " )").replace(/(?<!var)\(/g, "( ")
  var inputStack=str.split(/(?<!\,)\s+/)
  var value, log
  while(inputStack.length > 0) {
    var cur = inputStack.shift()
    if(isOperator(cur)) {
      if(cur == '(') {
        outputStack.push(cur)
      } else if(cur == ')') {
        var po = outputStack.pop()
        while(po != '(' && outputStack.length > 0) {
          outputQueue.push(po)
          po = outputStack.pop()
        }
        if(po != '(') {
          log = {reason: 'ERROR: Expression unmatched ()'}
        }
      } else {
        while(prioraty(cur, outputStack[outputStack.length - 1]) && outputStack.length > 0) {
          outputQueue.push(outputStack.pop())
        }
        outputStack.push(cur)
      }
    } else {
      outputQueue.push(cur)
    }
  }
  return {
    value: outputQueue,
    log: log
  }
}

function checkComputation(left, right, operator) {
  var value, log
  if (operator == '*') {
    if ((right.match(/[a-zA-Z]/) && left.match(/[a-zA-Z]/)) || (!right.match(/[a-zA-Z]/) && !left.match(/[a-zA-Z]/))) {
      log = {reason: 'ERROR: The multiplier must contain and contain only one integer'}
    }
  }
  if (operator == '/') {
    if (right.match(/[a-zA-Z]|(?<![1-9])[0]/)) {
      log = {reason: 'ERROR: Divisor must be an integer and cannot be zero'}
    }
  }
  if (operator == '+') {
    if (!(right.match(/[a-zA-Z%]/) && left.match(/[a-zA-Z%]/))) {
      log = {reason: 'ERROR: Addition cannot contain integers'}
    }
  }
  if (operator == '-') {
    if (!(right.match(/[a-zA-Z%]/) && left.match(/[a-zA-Z%]/))) {
      log = {reason: 'ERROR: Subtraction cannot contain integers'}
    }
  }
  return log
}

function getResult(left, right, operator) {
  var value, log, errLog
  if (left.match(/var/)) {
    left = cssVarFun(left)
  }
  if (right.match(/var/)) {
    right = cssVarFun(right)
  }
  errLog = checkComputation(left, right, operator)
  if (errLog) {
    return { value: null, log: errLog }
  }
  var result, value, unit
  var leftValue = getValueUnit(left)
  var rightValue = getValueUnit(right)
  if (left.match(/\(/) | right.match(/\(/)) {
    result = left + ' ' + operator + ' ' + right
  } else {
    if (operator == '*') {
      value = leftValue.value * rightValue.value
      if (leftValue.unit == null) {
        unit = rightValue.unit
      } else { unit = leftValue.unit}
      result = value + unit
    } else if (operator == '/') {
      if (parseInt(rightValue.value) != 0) {
        value = leftValue.value / rightValue.value
        unit = leftValue.unit
        result = value + unit
      }
    } else if (operator == '+') {
      if (JSON.stringify(leftValue.unit) == JSON.stringify(rightValue.unit)) {
        value = parseInt(leftValue.value) + parseInt(rightValue.value)
        unit = leftValue.unit
        result = value + unit
      } else result = '(' + left + ' ' + operator + ' ' + right + ')'
    } else if (operator == '-') {
      if (JSON.stringify(leftValue.unit) == JSON.stringify(rightValue.unit)) {
        value = parseInt(leftValue.value) - parseInt(rightValue.value)
        unit = leftValue.unit
        result = value + unit
      } else result = '(' + left + ' ' + operator + ' ' + right + ')'
    }
  }
  return { value: result, log: null }
}

function evalRpn(rpnQueue) {
  var outputStack = []
  var value, res, log
  while(rpnQueue.length > 0) {
    var cur = rpnQueue.shift()
    if(!isOperator(cur)) {
      outputStack.push(cur)
    } else {
      if(outputStack.length < 2) {
      log = {reason: 'ERROR: Expression does not conform to specification'}
      }
      var sec = outputStack.pop()
      var fir = outputStack.pop()
      res = getResult(fir, sec, cur)
      log = res.log
      if (log) {
        return {
          value: null,
          log: log
        }
      } else {
        outputStack.push(res.value)
      }
    }
  }
  if(outputStack.length != 1) {
    log = {reason: 'ERROR: Expression does not conform to specification'}
  } else {
    if (outputStack[0].match(/[+-]/)) {
      value = 'calc' + outputStack[0]
    } else {
      value = outputStack[0]
    }
  }
  return {
    value: value,
    log: log
  }
}

var cssPropData = []

function saveCssProp(name, value) {
  if (name.match(/\-\-/)) {
    while (value.match(/var/)) {
      var value = cssVarFun(value)
    }
    cssPropData.push({name: name,value: value})
  }
}

function cssVarFun(value) {
  if (value.match(/calc/)) {
    return value
  } else {
    if (value.match(/var/)) {
      if (value.match(/\,/)) {
        var cssVarFir = value.substring(0,value.indexOf(",")).replace("var(","").trim()
        var cssVarSec = value.substring(value.indexOf(",")+1,value.length).replace(")","").trim()
      } else {
          var cssVarFir = value.replace("var(","").replace(")","").trim()
          var cssVarSec = ""
      }
      let varValue = cssVarSec
      for(var i=0, len=cssPropData.length; i<len; i++) {
        var cPDName = cssPropData[i].name.trim()
        cssVarFir = util.hyphenedToCamelCase(cssVarFir)
        if (cssVarFir == cPDName) {
          varValue = cssPropData[i].value
        }
      }
      return varValue
    } else {
      return value
    }
  }
}

function expValidate(name, value) {
  var res, log
  saveCssProp(name, value)
  if (typeof value === 'string' && name != 'border') {
    if (value.match(/var/)) {
      value = cssVarFun(value)
    }
    if (value.match(/calc/)) {
      var checkOp =
        /[a-zA-Z0-9()]\+|\+[a-zA-Z0-9()]|[a-zA-Z0-9()](?<!\-)\-(?!\-)|(?<!\-)\-(?!\-)[a-zA-Z0-9()]|[a-zA-Z0-9()]\*|\*[a-zA-Z0-9()]|[a-zA-Z0-9()]\/|\/[a-zA-Z0-9()]/
      if (value.match(checkOp) && value.match(/calc\(|var\(\-\-/)) {
        log = {reason: 'ERROR: Expression error, A space is required before and after the operator'}
        return {
          log: log
        }
      }
      res = dal2Rpn(value)
      res = evalRpn(res.value)
      log = res.log
      value = res.value
    }
  }
  return {
    value: value,
    log: log
  }
}

/**
 * validate a CSS name/value pair
 *
 * @param  {string} name   camel cased
 * @param  {string} value
 * @return {object}
 * - value:string or null
 * - log:{reason:string} or undefined
 */
function validate(name, value) {
  var log, expRes
  expRes = expValidate(name, value)
  if (expRes.log) {
    return {
      value: null,
      log: expRes.log
    }
  } else {
    value = expRes.value
  }

  var result
  var validator = validatorMap[name]
  if (typeof validator === 'function') {
    const flag = /{{{(.+?)}}}|{{(.+?)}}/.test(value) && card
    if (typeof value !== 'function' &&  !flag) {
      result = validator(value, name)
    }
    /* istanbul ignore else */
    else {
      result = {value: value}
    }
    if (result.reason) {
      log = {reason: result.reason(name, value, result.value)}
    }
  }
  else {
    // ensure number type, no `px`
    /* istanbul ignore else */
    if (typeof value !== 'function') {
      var match = value.match(LENGTH_REGEXP)
      if (match && (!match[1] || SUPPORT_CSS_UNIT.indexOf(match[1]) === -1)) {
        value = parseFloat(value)
      }
    }
    result = {value: value}
    var suggestedName = SUGGESTED_PROP_NAME_GROUP[name]
    var suggested = suggestedName ? ', suggest `' + util.camelCaseToHyphened(suggestedName) + '`' : ''
    log = {reason: 'WARNING: `' + util.camelCaseToHyphened(name) +
      '` is not a standard attribute name and may not be supported' + suggested}
  }
  return {
    value: result.value,
    log: log
  }
}

var validateFuncMap = {
  length: LENGTH_VALIDATOR,
  number: NUMBER_VALIDATOR,
  date: DATE_VALIDATOR
}

module.exports = {
  BASIC_COLOR_KEYWORDS: BASIC_COLOR_KEYWORDS,
  EXTENDED_COLOR_KEYWORDS: EXTENDED_COLOR_KEYWORDS,

  LENGTH_VALIDATOR: LENGTH_VALIDATOR,
  COLOR_VALIDATOR: COLOR_VALIDATOR,
  COLOR_VAR_VALIDATOR: COLOR_VAR_VALIDATOR,
  NUMBER_VALIDATOR: NUMBER_VALIDATOR,
  INTEGER_VALIDATOR: INTEGER_VALIDATOR,
  genEnumValidator: genEnumValidator,

  TRANSITION_PROPERTY_VALIDATOR: TRANSITION_PROPERTY_VALIDATOR,
  TRANSITION_DURATION_VALIDATOR: TRANSITION_INTERVAL_VALIDATOR,
  TRANSITION_DELAY_VALIDATOR: TRANSITION_INTERVAL_VALIDATOR,
  TRANSITION_TIMING_FUNCTION_VALIDATOR: TRANSITION_TIMING_FUNCTION_VALIDATOR,

  PROP_NAME_GROUPS: PROP_NAME_GROUPS,
  validateFuncMap: validateFuncMap,

  map: validatorMap,
  validate: validate
}
