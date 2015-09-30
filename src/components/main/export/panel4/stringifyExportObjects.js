'use strict'

/**
 * converts all remaining objects in arrays in to strings
 * needed for passing to csv / xlsx
 */

import _ from 'lodash'

export default (exportObjects) => {
  exportObjects.forEach((object) => {
    Object.keys(object).forEach((key, objIndex) => {
      let value = object[key]
      if (_.isArray(value)) {
        value.forEach((val, vIndex) => {
          if (_.isPlainObject(val)) object[key][vIndex] = JSON.stringify(val)
        })
        object[key] = value.join(', ')
      } else if (_.isPlainObject(value)) {
        object[key] = JSON.stringify(value)
      }
    })
  })
  return exportObjects
}
