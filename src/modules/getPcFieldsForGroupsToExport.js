/**
 * input format for allFields:
 * {
    group: row.key[0],
    cType: row.key[1],
    cName: row.key[2],
    fName: row.key[3],
    fType: row.key[4],
    count: row.value
  }
 */
'use strict'

import _ from 'lodash'

export default (allFields, groupsToExport) => {
  return _.filter(allFields, (field) => _.includes(groupsToExport, field.group) && field.cType === 'propertyCollection')
}
