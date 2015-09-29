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
                const value = collection.Eigenschaften[fName]
                const key = `${cName}: ${fName}`
                exportObject[key] = value
              } else {
                // now handle rc
                const relations = collection.Beziehungen
                if (relations && relations.length > 0) {
                  /**
                   * next step depends on oneRowPerRelation
                   * if true: clone exportObject for every relation and:
                   *   - create field cName: Beziehungspartner
                   *     contains JSON.stringify of Beziehungspartner
                   *   - create field cName: Beziehungspartner GUID
                   *     contains the GUID
                   *   - create more fields if they exist
                   *   - in the end: add thes field names to all exportObjects
                   * if false:
                   *   - create field cName: Beziehungspartner
                   *     contains for every relation JSON.stringify(Beziehungspartner)
                   *   - create field cName: Beziehungspartner GUID's
                   *     contains an array of the rPartners GUID's
                   *   - if more fields: create them
                   *     contain an array of the values of the field
                   *   - in the end: add thes field names to all exportObjects
                   */
                  relations.forEach((relation, rIndex) => {
                    if (fName !== 'Beziehungspartner') {
                      const value = relation[fName]
                      const key = `${cName}: ${fName}`
                      exportObject[key] = value
                    } else {
                      // this is Beziehungspartner
                      // we want to return an array of rPartner objects and an array of GUIDs
                      const rPartners = relations[rIndex][fName]
                      const rPartnerObjects = rPartners.map((rPartner) => JSON.stringify(rPartner))
                      const rPartnerGuids = _.pluck(rPartners, 'GUID')
                    }
                  })
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
    if (_.isArray(exportObject)) {
      exportObjects = exportObjects.concat(exportObject)
    } else {
      exportObjects.push(exportObject)
    }
  })
  // console.log('buildExportObjects.js: exportObjects', exportObjects)
  if (fieldsToAddToAllExportObjects.length > 0) {
    // TODO: add all these fields to every export object if it does not already exist
    // BUT: how get right order?
    // like this: rebuild every export object new
  }
  return exportObjects
}
