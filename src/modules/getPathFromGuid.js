/*
 * gets guid
 * returns the full path
 */

import app from 'ampersand-app'
import getPathFromObject from './getPathFromObject.js'

export default (guid) => new Promise((resolve, reject) => {
  app.objectStore.getObject(guid)
    .then((object) => {
      const path = getPathFromObject(object)
      if (path.length > 0) {
        const url = `/${path.join('/')}`
        resolve({ path, url })
      } else {
        resolve(null)
      }
    })
    .catch((error) =>
      reject(`getPathFromGuid.js: error getting Item from objectStore for guid ${guid}:`, error)
    )
})
