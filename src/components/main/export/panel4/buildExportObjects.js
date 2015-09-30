/**
 * gets exportOptions and objects
 * builds export data
 * which is an array of objects containing keys (= field names) and values (= field values)
 * returns exportObjects
 */

'use strict'

import _ from 'lodash'

export default (exportOptions, objects, combineTaxonomies, oneRowPerRelation) => {
  let exportObjects = []
  let fieldsToAddToAllExportObjects = []
  objects.forEach((object) => {
    let exportObject = {}
    // 1. add _id if applicable
    if (_.get(exportOptions, 'object._id.export')) {
      const value = _.get(object, '_id', null)
      exportObject.GUID = value
    }
    // 2. add Gruppen if applicable
    if (_.get(exportOptions, 'object.Gruppen.export')) {
      const value = _.get(object, 'Gruppe', null)
      exportObject.Gruppe = value
    }
    // 3. push any other pc or rc field
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
            if (collection) {
              if (cType !== 'rc') {
                const value = _.get(collection, `Eigenschaften[${fName}]`, null)
                const key = `${cName}: ${fName}`
                exportObject[key] = value
              } else {
                // now handle rc
                const relations = collection.Beziehungen
                if (relations && relations.length > 0) {
                  /**
                   * next step depends on oneRowPerRelation
                   */
                  if (oneRowPerRelation) {
                    /**
                     * if oneRowPerRelation true: clone exportObject for every relation and:
                     *   - create field 'cName: Beziehungspartner'
                     *     contains JSON.stringify of Beziehungspartner
                     *   - create field 'cName: Beziehungspartner GUID'
                     *     contains the GUID
                     *   - create more fields if they exist
                     *   - in the end: add these field names to all exportObjects (fieldsToAddToAllExportObjects)
                     */
                    let exportObjectsToAdd = []
                    relations.forEach((relation) => {
                      let newExportObject = _.clone(exportObject)
                      Object.keys(relation).forEach((fName) => {
                        if (fName !== 'Beziehungspartner') {
                          const value = _.get(relation, fName, null)
                          const key = `${cName}: ${fName}`
                          newExportObject[key] = value
                        } else {
                          // this is Beziehungspartner
                          // add this field later to all export objects
                          fieldsToAddToAllExportObjects = _.union(fieldsToAddToAllExportObjects, [`${cName}: ${fName} GUID`])
                          // build Beziehungspartner
                          const rawValue = _.get(relation, fName, null)
                          const value = rawValue ? JSON.stringify(rawValue) : null
                          const key = `${cName}: ${fName}`
                          newExportObject[key] = value
                          // build Beziehungspartner GUID
                          const value2 = _.get(relation, `${fName}.GUID`, null)
                          const key2 = `${cName}: ${fName} GUID`
                          newExportObject[key2] = value2
                        }
                      })
                      exportObjectsToAdd.push(newExportObject)
                    })
                    exportObject = exportObjectsToAdd
                  } else {
                    /**
                     * if false:
                     *   - create field 'cName: Beziehungspartner'
                     *     contains for every relation JSON.stringify(Beziehungspartner)
                     *   - create field 'cName: Beziehungspartner GUID's'
                     *     contains an array of the rPartners GUID's
                     *   - if more fields: create them
                     *     contain an array of the values of the field
                     *   - in the end: add these field names to all exportObjects (fieldsToAddToAllExportObjects)
                     */
                    relations.forEach((relation) => {
                      if (fName !== 'Beziehungspartner') {
                        const value = _.get(relation, fName, null)
                        const key = `${cName}: ${fName}`
                        if (_.has(exportObject, key)) {
                          exportObject[key].push(value)
                        } else {
                          // maybe we should check if value is array?
                          exportObject[key] = [value]
                        }
                      } else {
                        // this is Beziehungspartner
                        // add this field later to all export objects
                        fieldsToAddToAllExportObjects = _.union(fieldsToAddToAllExportObjects, [`${cName}: ${fName} GUIDs`])
                        // we want to return an array of rPartner objects and an array of GUIDs
                        const rPartners = _.get(relation, fName, null)
                        if (rPartners) {
                          // build Beziehungspartner
                          const value = rPartners.map((rPartner) => JSON.stringify(rPartner))
                          const key = `${cName}: ${fName}`
                          if (_.has(exportObject, key)) {
                            exportObject[key] = _.union(exportObject[key], value)
                          } else {
                            exportObject[key] = value
                          }
                          // build Beziehungspartner GUID
                          const value2 = _.pluck(rPartners, 'GUID')
                          const key2 = `${cName}: ${fName} GUIDs`
                          if (_.has(exportObject, key2)) {
                            exportObject[key2] = _.union(exportObject[key2], value2)
                          } else {
                            exportObject[key2] = value2
                          }
                        }
                      }
                    })
                  }
                }
              }
            }
          }
        })
      }
    })
    /**
     * exportObject can either be a single object
     * or an array of objects (relations, oneRowPerRelation = false)
     */
    console.log('buildExportObjects.js, exportObject before adding to exportObjects', exportObject)
    if (_.isArray(exportObject)) {
      exportObjects = exportObjects.concat(exportObject)
    } else {
      exportObjects.push(exportObject)
    }
  })
  console.log('buildExportObjects.js, exportObjects before rebuilding with all fields', exportObjects)
  // console.log('buildExportObjects.js: exportObjects', exportObjects)
  if (fieldsToAddToAllExportObjects.length > 0) {
    // add all these fields to every export object if it does not already exist
    // BUT: how get right order?
    // like this: rebuild every export object new
    let exportObjectFields = _.keys(exportObjects[0])
    exportObjectFields = _.union(exportObjectFields, fieldsToAddToAllExportObjects)
    exportObjectFields.sort()
    // make sure guid is first field
    exportObjectFields = _.without(exportObjectFields, 'GUID')
    exportObjectFields.unshift('GUID')
    console.log('buildExportObjects.js, exportObjectFields', exportObjectFields)
    // loop exportObjects, build new objects with all fields and add them to exportObjectsWithAllFields
    let exportObjectsWithAllFields = []
    exportObjects.forEach((exportObject) => {
      let newObject = {}
      exportObjectFields.forEach((field) => {
        newObject[field] = _.get(exportObject, field, null)
      })
      exportObjectsWithAllFields.push(newObject)
    })
    exportObjects = exportObjectsWithAllFields
    console.log('buildExportObjects.js, exportObjects after rebuilding with all fields', exportObjects)
  }
  return exportObjects
}
