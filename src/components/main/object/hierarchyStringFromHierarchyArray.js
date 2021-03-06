/*
 * gets a hierarchy array (array of objects with GUID and Name)
 * generates a string of the names, separated by line break
 * this string is later rendered into a textarea
 */

import { isArray, map as _map } from 'lodash'

export default (hierarchyArray) => {
  if (!isArray(hierarchyArray)) return ''

  const names = _map(hierarchyArray, 'Name')
  return names.join('\n')
}
