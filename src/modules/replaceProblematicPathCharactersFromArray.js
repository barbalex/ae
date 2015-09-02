/*
 * the routing breaks if path elements include certain characters
 * this function gets a path array
 * it replaces in all elements problematic characters
 * and returns the array
 */

'use strict'

import replaceProblematicPathCharactersFromString from './replaceProblematicPathCharactersFromString.js'

export default (elArray) => {
  let newElArray = []
  elArray.forEach((el) => {
    if (el !== undefined && el !== null) {
      let newEl = el
      newEl = replaceProblematicPathCharactersFromString(el)
      newElArray.push(newEl)
    }
  })
  return newElArray
}
