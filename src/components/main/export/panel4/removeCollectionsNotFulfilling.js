'use strict'

import _ from 'lodash'
import isFilterFulfilled from './isFilterFulfilled.js'

export default (exportOptions, objects) => {
  // console.log('removeCollectionsNotFulfilling.js, objects.length passed', objects.length)
  // list all pc's and rc's that are filtered
  // in all objects remove these pc's and rc's if they do not fulfill the filter criteria
  Object.keys(exportOptions).forEach((cName) => {
    const cType = exportOptions[cName].cType
    /**
     * skip cName === 'object'
     * if cType === 'taxonomy': skip.
     */
    if (cName !== 'object' && cType !== 'taxonomy') {
      Object.keys(exportOptions[cName]).forEach((fName) => {
        /**
         * always exclude fName === 'cType'
         */
        if (fName !== 'cType') {
          const filterValue = exportOptions[cName][fName].value
          const co = exportOptions[cName][fName].co
          // console.log('removeCollectionsNotFulfilling.js, cName', cName)
          // console.log('removeCollectionsNotFulfilling.js, fName', fName)
          // console.log('removeCollectionsNotFulfilling.js, filterValue', filterValue)
          // console.log('removeCollectionsNotFulfilling.js, co', co)
          /**
           * only filter if a filter value was passed for this field
           */
          if (filterValue !== undefined) {
            /**
             * now loop all objects
             * and remove collections not fulfilling
             */
            objects.forEach((object, oIndex) => {
              if (cType === 'pc') {
                object.Eigenschaftensammlungen.forEach((pc, pcIndex) => {
                  if (pc.Name === cName) {
                    let fulfilled = true
                    if (pc.Eigenschaften[fName] === undefined) {
                      fulfilled = false
                    } else {
                      fulfilled = isFilterFulfilled(pc.Eigenschaften[fName], filterValue, co)
                    }
                    if (!fulfilled) object.Eigenschaftensammlungen.splice(pcIndex, 1)
                  }
                })
              }
              if (cType === 'rc') {
                console.log('removeCollectionsNotFulfilling.js, cType === rc', cType === 'rc')
                const rcs = object.Beziehungssammlungen
                const rcsIndex = rcs.length
                while (rcsIndex--) {
                  if (rcs[rcsIndex].Name === cName) {
                    const relations = rcs[rcsIndex].Beziehungen
                    const relIndex = relations.length
                    while (relIndex--) {
                      let fulfilled = true
                      if (relations[relIndex][fName] === undefined) {
                        fulfilled = false
                      } else {
                        fulfilled = isFilterFulfilled(relations[relIndex][fName], filterValue, co)
                      }
                      if (!fulfilled) relations.splice(relIndex, 1)
                    }
                    if (relations.length === 0) rcs[rcsIndex].splice(rcsIndex, 1)
                  }
                }
              }
            })
          }
        }
      })
    }
  })
  return objects
}
