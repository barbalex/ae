/*
 * gets a hierarchy array (array of objects with GUID and Name)
 * generates a string of the names, separated by line break
 * this string is later rendered into a textarea
 */

'use strict'

import { isArray, pluck } from 'lodash'

export default (hierarchyArray) => {
  if (!isArray(hierarchyArray)) return ''

  const names = pluck(hierarchyArray, 'Name')
  return names.join('\n')
}
