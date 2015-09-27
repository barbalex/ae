/**
 * gets exportOptions and objects
 * builds export data
 * which is an array of objects containing keys (= field names) and values (= field values)
 * returns exportObjects
 */

'use strict'

import _ from 'lodash'

export default (exportOptions, objects, combineTaxonomies) => {
  let exportObjects = []
  objects.forEach((object) => {
    let exportObject = {}
    // add _id if applicable
    if (_.get(exportOptions, 'object._id.export')) {
      const value = _.get(object, '_id', null)
      exportObject.GUID = value
    }
    // add Gruppen if applicable
    if (_.get(exportOptions, 'object.Gruppen.export')) {
      const value = _.get(object, 'Gruppe', null)
      exportObject.Gruppe = value
    }
    // push any other pc or rc field
    Object.keys(exportOptions).forEach((cName) => {
      const cType = exportOptions[cName].cType
      if (cType) {
        // o.k., this is not object
        // TODO: deal with combineTaxonomies
        Object.keys(exportOptions[cName]).forEach((fName) => {
          if (_.get(exportOptions, `${cName}.${fName}.export`)) {
            const value = _.get(exportOptions, `${cName}.${fName}.value`, null)
            const key = `${cName}: ${fName}`
            exportObject[key] = value
          }
        })
      }
    })
    console.log('exportObject', exportObject)
    exportObjects.push(exportObject)
  })
  return exportObjects
}
