/*
 * the routing breaks if path elements include certain characters
 * this function gets a path array
 * it replaces in all elements problematic characters
 * and returns the array
 */

'use strict'

import _ from 'lodash'
import replaceProblematicPathCharactersFromString from './replaceProblematicPathCharactersFromString.js'

export default function (elArray) {
  let newElArray = []
  _.forEach(elArray, function (el) {
    let newEl = el
    newEl = replaceProblematicPathCharactersFromString(el)
    newElArray.push(newEl)
  })
  return newElArray
}
