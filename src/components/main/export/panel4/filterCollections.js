'use strict'

/**
 * gets exportOptions and objects
 * loops all fields in exportOptions
 * and filters objects according to value and comparison operator
 * returns filtered objects
 */

import _ from 'lodash'
import isFilterFulfilled from './isFilterFulfilled.js'

export default (exportOptions, objects, combineTaxonomies) => {
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
            objects = _.filter(objects, (object) => {
              // find collection with this name
              let collections = []
              if (cType === 'taxonomy' && !combineTaxonomies) collections = object.Taxonomien
              if (cType === 'pc') collections = object.Eigenschaftensammlungen
              if (cType === 'rc') collections = object.Beziehungssammlungen
              const collection = _.find(collections, (c) => c.Name === cName)
              if (collection) {
                // if taxonomy or pc, check directly
                if (cType !== 'rc') return isFilterFulfilled(collection.Eigenschaften[fName], filterValue, co)
                // if rc, check if any relation fulfills
                const relations = collection.Beziehungen
                if (relations && relations.length > 0) {
                  let returnFromRelationsLoop = false
                  relations.forEach((relation) => {
                    if (isFilterFulfilled(relation[fName], filterValue, co)) {
                      returnFromRelationsLoop = true
                    }
                  })
                  return returnFromRelationsLoop
                }
                return false
              }
              return false
            })
          }
        }
      })
    }
  })
  // console.log('filterCollections.js: objects before combineTaxonomies', objects)
  if (combineTaxonomies) {
    /**
     * exportOptions does not contain cNames of the taxonomies
     * instead it contains 'Taxonomie(n)'
     */
    Object.keys(exportOptions['Taxonomie(n)']).forEach((fName) => {
      if (fName !== 'cType') {
        const filterValue = exportOptions['Taxonomie(n)'][fName].value
        const co = exportOptions['Taxonomie(n)'][fName].co
        /**
         * only filter if a filter value was passed for this field
         */
        if (filterValue !== undefined) {
          objects = _.filter(objects, (object) => {
            let returnFromRelationsLoop = false
            object.Taxonomien.forEach((taxonomy) => {
              if (isFilterFulfilled(taxonomy.Eigenschaften[fName], filterValue, co)) {
                returnFromRelationsLoop = true
              }
            })
            return returnFromRelationsLoop
          })
        }
      }
    })
  }
  // console.log('filterCollections.js: objects to return', objects)
  return objects
}
