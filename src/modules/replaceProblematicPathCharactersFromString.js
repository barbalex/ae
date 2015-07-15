/*
 * the routing breaks if path elements include certain characters
 * this function gets a string = path element
 * it replaces all problematic characters
 * and returns the string
 */

'use strict'

function escapeRegExp (string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
}

function replaceAll (string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

export default function (el) {
  el = replaceAll(el, '.', '')
  el = replaceAll(el, '(', '')
  el = replaceAll(el, ')', '')
  return el
}
