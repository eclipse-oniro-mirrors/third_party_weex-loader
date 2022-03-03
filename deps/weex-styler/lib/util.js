const { DEVICE_LEVEL } = require('../../lite/lite-enum')

/**
 * rules:
 * - abc-def -> abcDef
 * - -abc-def -> AbcDef
 *
 * @param  {string} value
 * @return {string}
 */
exports.hyphenedToCamelCase = function hyphenedToCamelCase(value) {
  return value.replace(/(?<!-)-([a-z])/g, function(s, m) {
    return m.toUpperCase()
  })
}

/**
 * rules:
 * - abcDef -> abc-def
 * - AbcDef -> -abc-def
 *
 * @param  {string} value
 * @return {string}
 */
exports.camelCaseToHyphened = function camelCaseToHyphened(value) {
  return value.replace(/([A-Z])/g, function(s, m) {
    if (typeof m === 'string') {
      return '-' + m.toLowerCase()
    }
    return m
  })
}

exports.isValidValue = function isValidValue(value) {
  return "number" == typeof value || "string" == typeof value
}

/**
 * rules:
 * assign abbreviated values to expanded attributes
 * margin:1px 2px -> marginTop:1px;marginRight:2px;marginBottom:1px;marginLeft:2px;
 *
 * @param  {obejct} object
 * @param  {string} value
 * @param  {obejct} spliceName
 */
exports.splitAttr = function (object, value, spliceName) {
  const values = value.toString().trim().split(/(?<!\+|\-|\*|\/|\,)\s+(?!\+|\-|\*|\/|\,)/)
  if (values) {
    switch (values.length) {
      case 1:
        spliceName.forEach(function (item) {
          object[item] = values[0]
        })
        break
      case 2:
        spliceName.forEach(function (item, index) {
          object[item] = index % 2 ? values[1] : values[0]
        })
        break
      case 3:
        spliceName.forEach(function (item, index) {
          object[item] = index % 2 ? values[1] : values[index]
        })
        break
      default:
        spliceName.forEach(function (item, index) {
          object[item] = values[index]
        })
    }
  }
}

const RICH_SPLECIAL_ATTR = {
  MARGIN: 'margin',
  PADDING: 'padding',
  BORDER: 'border',
  BORDER_WIDTH: 'borderWidth',
  BORDER_COLOR: 'borderColor',
  BORDER_STYLE: 'borderStyle',
  BORDER_RADIUS: 'borderRadius',
  BORDER_BOTTOM: 'borderBottom',
  BORDER_RIGHT: 'borderRight',
  BORDER_LEFT: 'borderLeft',
  BORDER_TOP: 'borderTop',
  GRID_GAP: 'gridGap',
  BOX_SHADOW: 'boxShadow',
  ANIMATION: 'animation'
}

const LITE_SPLECIAL_ATTR = {
  MARGIN: 'margin',
  PADDING: 'padding',
  BORDER_WIDTH: 'borderWidth',
  BORDER_COLOR: 'borderColor'
}

/**
 * Special style attributes that need to be expanded
 *
 */
exports.SPLECIAL_ATTR = process.env.DEVICE_LEVEL === DEVICE_LEVEL.LITE ? LITE_SPLECIAL_ATTR : RICH_SPLECIAL_ATTR
