/**
 * gets exportOptions and objects
 * builds export data
 * which is an array of objects containing keys (= field names) and values (= field values)
 * returns exportObjects
 */

'use strict'

import _ from 'lodash'

function getValueOfField (object, cType, cName, fName) {
  let cTypeName
  switch (cType) {
  case 'taxonomy':
    cTypeName = 'Taxonomien'
    break
  case 'pc':
    cTypeName = 'Eigenschaftensammlungen'
    break
  case 'rc':
    cTypeName = 'Beziehungssammlungen'
    break
  default:
    return null
  }
  const collection = _.find(object[cTypeName], (c) => c.Name === cName)
  if (collection) return collection.Eigenschaften[fName]
  return null
}

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
            /**
             * get value of this field in object
             */
            const value = getValueOfField(object, cType, cName, fName)
            const key = `${cName}: ${fName}`
            exportObject[key] = value
          }
        })
      }
    })
    exportObjects.push(exportObject)
  })
  // console.log('buildExportObjects.js: exportObjects', exportObjects)
  return exportObjects
}
