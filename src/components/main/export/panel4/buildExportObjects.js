/**
 * gets exportOptions and objects
 * builds export data
 * which is an array of objects containing keys (= field names) and values (= field values)
 * returns exportObjects
 */

'use strict'

import _ from 'lodash'

export default (exportOptions, objects) => {
  let exportObjects = []
  // push _id if applicable
  if (_.get(exportOptions, 'object._id.export')) {
    const value = _.get('object._id.value', null)
    exportObjects.push({ 'GUID': value})
  }
  // push Gruppen if applicable
  if (_.get(exportOptions, 'object.Gruppen.export')) {
    const value = _.get(exportOptions, 'object.Gruppen.value', null)
    exportObjects.push({ 'GUID': value})
  }
  // push any other pc or rc field
  Object.keys(exportOptions).forEach((cName) => {
    const cType = exportOptions[cName].cType
    if (cType) {
      // o.k., this is not object
      Object.keys(exportOptions[cName]).forEach((fName) => {
        if (_.get(exportOptions, `${cName}.${fName}.export`)) {
          const value = _.get(exportOptions, `${cName}.${fName}.value`, null)
          const key = `${cName}: ${fName}`
          exportObjects.push({ [key]: value})
        }
      })
    }
  })
  return exportObjects
}
