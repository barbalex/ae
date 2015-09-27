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
    if (cType) {
      Object.keys(exportOptions[cName]).forEach((fName) => {
        /**
         * always exclude cName === 'object'
         * always exclude fName === 'cType'
         * if combineTaxonomies, exclude cType === 'taxonomy'
         */
        if (cName !== 'object' && fName !== 'cType' && !(cType === 'taxonomy' && combineTaxonomies)) {
          const filterValue = exportOptions[cName][fName].value
          const co = exportOptions[cName][fName].co
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
      })
    }
  })
  if (combineTaxonomies) {
    /**
     * exportOptions does not contain cNames of the taxonomies
     * instead it contains 'Taxonomie(n)'
     */
    Object.keys(exportOptions['Taxonomie(n)']).forEach((fName) => {
      if (fName !== 'cType') {
        const filterValue = exportOptions['Taxonomie(n)'][fName].value
        const co = exportOptions['Taxonomie(n)'][fName].co
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
    })
  }
  return objects
}
