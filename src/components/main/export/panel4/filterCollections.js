'use strict'

/**
 * gets exportOptions and objects
 * loops all fields in exportOptions
 * and filters objects according to value and comparison operator
 * returns filtered objects
 */

import _ from 'lodash'
import isFilterFulfilled from './isFilterFulfilled.js'

export default (exportOptions, objects, taxonomienZusammenfassen) => {
  Object.keys(exportOptions).forEach((cName) => {
    const cType = exportOptions[cName].cType
    if (cType) {
      Object.keys(exportOptions[cName]).forEach((fName) => {
        if (cName !== 'object') {
          const filterValue = exportOptions[cName][fName].value
          const co = exportOptions[cName][fName].co
          objects = _.filter(objects, (object) => {
            // find collection with this name
            let collections = object.Taxonomien
            if (cType === 'pc') collections = object.Eigenschaftensammlungen
            if (cType === 'rc') collections = object.Beziehungssammlungen
            const collection = _.find(collections, (co) => co.Name === cName)
            if (collection) {
              // if taxonomy or pc, check directly
              if (cType !== 'rc') return isFilterFulfilled(collection.Eigenschaften[fName], filterValue, co)
              // if rc, check if any relation fulfills
              const relations = collection.Beziehungen
              if (relations && relations.length > 0) {
                relations.forEach((relation) => {
                  if (isFilterFulfilled(relation[fName], filterValue, co)) return true
                })
                return false
              }
              return false
            }
            return false
          })
        }
      })
    }
    if (taxonomienZusammenfassen) {
      /**
       * exportOptions does not contain cNames of the taxonomies
       * instead it contains 'Taxonomie(n)'
       */
      Object.keys(exportOptions[cName]).forEach((fName) => {
        if (cType === 'taxonomy') {
          const filterValue = exportOptions['Taxonomie(n)'][fName].value
          const co = exportOptions['Taxonomie(n)'][fName].co
          objects = _.filter(objects, (object) => {
            // find collection with this name
            let collections = object.Taxonomien
            const collection = _.find(collections, (co) => co.Name === cName)
            if (collection) {
              // if taxonomy or pc, check directly
              if (cType !== 'rc') return isFilterFulfilled(collection.Eigenschaften[fName], filterValue, co)
              // if rc, check if any relation fulfills
              const relations = collection.Beziehungen
              if (relations && relations.length > 0) {
                relations.forEach((relation) => {
                  if (isFilterFulfilled(relation[fName], filterValue, co)) return true
                })
                return false
              }
              return false
            }
            return false
          })
        }
      })
    }
  })
  return objects
}
