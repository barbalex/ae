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
  let taxFields = _.filter(allFields, (field) => _.includes(groupsToExport, field.group) && field.cType === 'taxonomy')
  // same fields can be in multiple groups > remove group, then group and sum count
  taxFields = taxFields.map((field) => {
    delete field.group
    delete field.cType
    return field
  })
  /**
   * new input format for allFields:
   * {
      cName: '',
      fName: '',
      fType: '',
      count: ''
    }
   */
}
