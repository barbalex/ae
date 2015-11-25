/**
 * input format for allFields:
 * {
    group: '',
    cType: '',
    cName: '',
    fName: '',
    fType: '',
    count: ''
  }
 *
 * collectionType is one of: taxonomy, propertyCollection, relation
 */
'use strict'

import _ from 'lodash'

export default (allFields, groupsToExport, collectionType, combineTaxonomies) => {
  let fields = allFields.filter((field) => groupsToExport.includes(field.group) && field.cType === collectionType)
  // same fields can be in multiple groups > remove group, then group and sum count
  fields = fields.map((field) => {
    delete field.cType
    if (combineTaxonomies && collectionType === 'taxonomy') field.cName = 'Taxonomie(n)'
    return field
  })
  /**
   * format for allFields now:
   * {
      group: '',
      cName: '',
      fName: '',
      fType: '',
      count: ''
     }
   */
  let taxonomyNameObject = _.groupBy(fields, (field) => field.cName)
  /**
   * format for taxonomyNameObject:
   * {
      cName: [{group: '', cName: '', fName : '', fType: '', count: '' }, ...],
      ...
     }
   */
  _.forEach(taxonomyNameObject, (cNameArray, key) => {
    cNameArray = cNameArray.map((field) => {
      delete field.cName
      return field
    })
    /**
     * format for taxonomyNameObject now:
     * {
        cName1: [{group: '', fName : '', fType: '', count: '' }, ...],         <= this is cNameArray
        cName2...
       }
     */
    let cNameObject = _.groupBy(cNameArray, (field) => field.fName)
    /**
     * format for taxonomyNameObject now:
     *  {
          cName1: {                                          <= this is cNameObject
            fName1: [{group: '', fName : '', fType: '', count: '' }, ...],
            fName2...
          },
          cName2...
        }
     */
    _.forEach(cNameObject, (fNameArray, key) => {
      fNameArray = fNameArray.map((field) => {
        delete field.fName
        return field
      })
      /**
       * format for taxonomyNameObject now:
       *  {
            cName1: {                                          <= this is cNameObject
              fName1: [{group: '', fType: '', count: '' }, ...],
              fName2...
            },
            cName2...
          }
       */
      let fNameObject = {
        fType: null,
        count: 0,
        groups: []
      }
      fNameArray.forEach((object) => {
        fNameObject.fType = object.fType
        fNameObject.count += object.count
        fNameObject.groups.push(object.group)
      })
      cNameObject[key] = fNameObject

    })

    taxonomyNameObject[key] = cNameObject
    /**
     * format for taxonomyNameObject now:
     *  {
          cName1: {                                          <= this is cNameObject
            fName1: { group: '', fType: '', count: '' },
            fName2...
          },
          cName2...
        }
     */
  })
  return taxonomyNameObject
}
