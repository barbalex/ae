'use strict'

/**
 * gets exportOptions and objects
 * loops all fields in exportOptions
 * and filters objects according to value and comparison operator
 * returns filtered objects
 */

import isFilterFulfilled from './isFilterFulfilled.js'
import isFilterFulfilledForBeziehungspartner from './isFilterFulfilledForBeziehungspartner.js'

export default (exportOptions, objects, combineTaxonomies, onlyObjectsWithCollectionData) => {
  Object.keys(exportOptions).forEach((cName) => {
    const cType = exportOptions[cName].cType
    /**
     * skip cName === 'object'. Was dealt with in stores.js
     * if cType === 'taxonomy' and combineTaxonomies: skip. Will be dealt with below
     */
    if (cName !== 'object' && !(cType === 'taxonomy' && combineTaxonomies)) {
      Object.keys(exportOptions[cName]).forEach((fName) => {
        /**
         * always exclude fName === 'cType'
         */
        if (fName !== 'cType') {
          const filterValue = exportOptions[cName][fName].value
          const co = exportOptions[cName][fName].co
          /**
           * only filter if a filter value was passed for this field
           */
          if (filterValue !== undefined) {
            objects = objects.filter((object) => {
              // find collection with this name
              let collections = []
              if (cType === 'pc') collections = object.Eigenschaftensammlungen
              if (cType === 'rc') collections = object.Beziehungssammlungen
              let collection = collections.find((c) => c.Name === cName)
              if (cType === 'taxonomy' && !combineTaxonomies && object.Taxonomien) {
                collections = object.Taxonomien
                const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy['Standardtaxonomie'])
                // TODO: later loop all taxonomies and return if any fulfills
                collection = standardtaxonomie
              }
              if (collection) {
                // if taxonomy, check directly
                const isFulfilled = isFilterFulfilled(collection.Eigenschaften[fName], filterValue, co)
                if (cType === 'pc' && !onlyObjectsWithCollectionData && !isFulfilled) {
                  // this data should not be delivered > empty all fields
                  Object.keys(collection).forEach((key) => collection[key] = null)
                }
                return isFulfilled
              }
              return false
            })
          }
        }
      })
    }
  })
  // console.log('filterCollections.js: objects to return', objects)
  return objects
}
