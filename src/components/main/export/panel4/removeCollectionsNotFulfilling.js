'use strict'

import _ from 'lodash'
import isFilterFulfilled from './isFilterFulfilled.js'

export default (exportOptions, objects) => {
  console.log('removeCollectionsNotFulfilling.js, objects.length passed', objects.length)
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
          console.log('removeCollectionsNotFulfilling.js, cName', cName)
          console.log('removeCollectionsNotFulfilling.js, fName', fName)
          console.log('removeCollectionsNotFulfilling.js, filterValue', filterValue)
          console.log('removeCollectionsNotFulfilling.js, co', co)
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
                objects[oIndex].Eigenschaftensammlungen.forEach((pc, pcIndex) => {
                  if (pc.Name === cName) {
                    let fulfilled = true
                    if (pc.Eigenschaften[fName] === undefined) {
                      fulfilled = false
                    } else {
                      fulfilled = isFilterFulfilled(pc.Eigenschaften[fName], filterValue, co)
                    }
                    if (!fulfilled) objects[oIndex].Eigenschaftensammlungen.splice(pcIndex, 1)
                  }
                })
              }
              if (cType === 'rc') {
                console.log('removeCollectionsNotFulfilling.js, cType === rc', cType === 'rc')
                object.Beziehungssammlungen.forEach((rc, rcIndex) => {
                  if (rc.Name === cName) {
                    objects[oIndex].Beziehungssammlungen[rcIndex].Beziehungen = _.filter((relation) => isFilterFulfilled(relation[fName], filterValue, co))
                    if (objects[oIndex].Beziehungssammlungen[rcIndex].Beziehungen.length === 0) objects[oIndex].Beziehungssammlungen.splice(rcIndex, 1)
                  }
                })
              }
            })
          }
        }
      })
    }
  })
  return objects
}
