/**
 * gets exportOptions and objects
 * builds export data
 * which is an array of objects containing keys (= field names) and values (= field values)
 * returns exportObjects
 */

'use strict'

import _ from 'lodash'

export default (exportOptions, objects, combineTaxonomies, oneRowPerRelation, onlyObjectsWithCollectionData) => {
  console.log('buildExportObjects.js, exportOptions', exportOptions)
  let exportObjects = []
  let fieldsToAddToAllExportObjects = []
  objects.forEach((object) => {
    /**
     * if onlyObjectsWithCollectionData = true,
     * objects with missing collection will be detected while processing the data
     * and the exportObject not added
     */
    let objectMissesCollection = false
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
        Object.keys(exportOptions[cName]).forEach((fName) => {
          if (_.get(exportOptions, `${cName}.${fName}.export`)) {
            // first set null value to make shure every field is created. Will be updated later
            exportObject[`${cName}: ${fName}`] = null
            /**
             * get value of this field in object
             */
            const cTypeNames = {
              taxonomy: 'Taxonomien',
              pc: 'Eigenschaftensammlungen',
              rc: 'Beziehungssammlungen'
            }
            const cTypeName = cTypeNames[cType]
            let collection
            if (cType === 'taxonomy' && combineTaxonomies && object.Taxonomien) {
              // TODO: do the following steps for ALL taxonomies
              // i.e. create exportObject if any of the taxonomies contain desired fields
              const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy['Standardtaxonomie'])
              collection = standardtaxonomie
            } else {
              collection = _.find(object[cTypeName], (c) => c.Name === cName)
            }
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
                     *   - in the end: add 'cName: Beziehungspartner GUID' to all exportObjects
                     */
                    let exportObjectsToAdd = []
                    relations.forEach((relation) => {
                      let newExportObject = _.clone(exportObject)
                      Object.keys(relation).forEach((rKey) => {
                        if (fName !== 'Beziehungspartner') {
                          const value = _.get(relation, rKey, null)
                          const key = `${cName}: ${fName}`
                          newExportObject[key] = value
                        } else {
                          // this is Beziehungspartner
                          // add this field later to all export objects
                          fieldsToAddToAllExportObjects = _.union(fieldsToAddToAllExportObjects, [`${cName}: ${fName} GUID`])
                          // build Beziehungspartner
                          const rPartners = _.get(relation, rKey, null)
                          const key = `${cName}: ${fName}`
                          newExportObject[key] = rPartners
                          // build Beziehungspartner GUID
                          const guidArray = _.pluck(rPartners, `GUID`)
                          const key2 = `${cName}: ${fName} GUID`
                          newExportObject[key2] = guidArray
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
                     *   - create field 'cName: Beziehungspartner GUIDs'
                     *     contains an array of the rPartners GUID's
                     *   - if more fields: create them
                     *     contain an array of the values of the field
                     *   - in the end: add 'cName: Beziehungspartner GUID's' to all exportObjects
                     */
                    relations.forEach((relation) => {
                      if (fName !== 'Beziehungspartner') {
                        const value = _.get(relation, fName, null)
                        const key = `${cName}: ${fName}`
                        if (_.has(exportObject, key)) {
                          exportObject[key] = _.union(exportObject[key], value)
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
                        // console.log('rPartners', rPartners)
                        if (rPartners && rPartners.length > 0) {
                          // build Beziehungspartner
                          const key = `${cName}: ${fName}`
                          if (exportObject[key]) {
                            exportObject[key] = _.union(exportObject[key], rPartners)
                          } else {
                            exportObject[key] = rPartners
                          }
                          /**
                           * Beziehungspartner is an array of objects
                           */
                          // build Beziehungspartner GUID
                          const guidArray = _.pluck(rPartners, 'GUID')
                          const key2 = `${cName}: ${fName} GUIDs`
                          if (_.has(exportObject, key2)) {
                            exportObject[key2] = _.union(exportObject[key2], guidArray)
                          } else {
                            exportObject[key2] = guidArray
                          }
                        }
                      }
                    })
                  }
                }
              }
            } else {
              // no such collection exists in this object > remove this object if onlyObjectsWithCollectionData = true
              objectMissesCollection = true
            }
          }
        })
      }
    })
    /**
     * now add exportObject to exportObjects
     * dont add if onlyObjectsWithCollectionData = true and objectMissesCollection = true
     */
    if (!(onlyObjectsWithCollectionData && objectMissesCollection)) {
      /**
       * exportObject can either be a single object
       * or an array of objects (relations, oneRowPerRelation = false)
       */
      if (_.isArray(exportObject)) {
        exportObjects = exportObjects.concat(exportObject)
      } else {
        exportObjects.push(exportObject)
      }
    }
  })
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
  }
  // console.log('buildExportObjects.js, exportObjects', exportObjects)
  return exportObjects
}
