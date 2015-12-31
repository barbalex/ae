/*
 * gets guid
 * returns the full path
 */

'use strict'

import app from 'ampersand-app'
import getPathFromObject from './getPathFromObject.js'

export default (guid) => {
  // console.log('getPathFromGuid.js, guid', guid)
  return new Promise((resolve, reject) => {
    app.objectStore.getObject(guid)
      .then((object) => {
        const path = getPathFromObject(object)
        if (path.length > 0) {
          const url = '/' + path.join('/')
          resolve({ path, url })
        } else {
          resolve(null)
        }
      })
      .catch((error) =>
        reject('getPathFromGuid.js: error getting Item from objectStore for guid ' + guid + ':', error)
      )
  })
}
