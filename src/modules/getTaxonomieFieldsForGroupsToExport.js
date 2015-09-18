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
  console.log('getTaxonomieFieldsForGroupsToExport.js, taxFields after filtering:', taxFields)
  // same fields can be in multiple groups > remove group, then group and sum count
  taxFields = taxFields.map((field) => {
    delete field.group
    delete field.cType
    return field
  })
  console.log('getTaxonomieFieldsForGroupsToExport.js, taxFields after removing group and cType:', taxFields)
  /**
   * new input format for allFields:
   * {
      cName: '',
      fName: '',
      fType: '',
      count: ''
     }
   */
  let taxCollectionsObject = _.groupBy(taxFields, (field) => field.cName)
  console.log('getTaxonomieFieldsForGroupsToExport.js, taxCollectionsObject after grouping by cName:', taxCollectionsObject)
  /**
   * format for taxCollectionsObject:
   * {
      cName: [{cName: , fName : , fType: , count: }],
      ...
     }
   */
  _.forEach(taxCollectionsObject, (fieldsArray, key) => {
    fieldsArray = fieldsArray.map((field) => {
      delete field.cName
      return field
    })
    let fieldNameObject = _.groupBy(fieldsArray, (field) => field.fName)
    /**
     * format for fieldNameObject:
     * {fName: [{fName : , fType: , count: }]}
     */
    _.forEach(fieldNameObject, (fieldArray, key) => {
      fieldArray = fieldArray.map((field) => {
        delete field.fName
        return field
      })

      let fTypeObject = _.groupBy(fieldArray, (field) => field.fType)
      fieldNameObject[key] = fTypeObject
      /**
       * format for fTypeObject
       * {count: , fType: }
       */
      /*let object = {
        fType: null,
        count: 0
      }
      let count = 0
      _.forEach(fTypeObject, (value, key) => {
        count = count + value.count
      })
      fTypeObject[key] = count*/
    })

    taxCollectionsObject[key] = fieldNameObject
    /**
     * format for taxCollectionsObject:
     * {
     *   cName: [
     *     fName: { fType: , count: }
     *   },
     *   ...
     * ]
     */
  })
  return taxCollectionsObject
}
