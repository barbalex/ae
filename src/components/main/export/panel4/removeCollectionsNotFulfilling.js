'use strict'

import _ from 'lodash'
import isFilterFulfilled from './isFilterFulfilled.js'

export default (exportOptions, objects) => {
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
          /**
           * only filter if a filter value was passed for this field
           */
          if (filterValue !== undefined) {
            objects.forEach((object) => {
              if (cType === 'pc') {
                object.Eigenschaftensammlungen = _.reject((pc) => {
                  return pc.Name === cName && !isFilterFulfilled(pc.Eigenschaften[fName], filterValue, co)
                })
              }
              if (cType === 'rc') {
                object.Beziehungssammlungen.forEach((rc, index) => {
                  if (rc.Name === cName) {
                    rc.Beziehungen = _.reject((relation) => !isFilterFulfilled(relation[fName], filterValue, co))
                    if (rc.Beziehungen.length === 0) object.Beziehungssammlungen.splice(index, 1)
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
