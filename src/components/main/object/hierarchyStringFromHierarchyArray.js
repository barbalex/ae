/*
 * gets a hierarchy array (array of objects with GUID and Name)
 * generates a string of the names, separated by line break
 * this string is later rendered into a textarea
 */

'use strict'

import _ from 'lodash'

export default function (hierarchyArray) {
  if (!_.isArray(hierarchyArray)) return ''

  const names = _.pluck(hierarchyArray, 'Name')

  return names.join('\n')
}
