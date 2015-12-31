/*
 * gets an object passed
 * generates its path
 * and updates it in localDb
 */

'use strict'

import app from 'ampersand-app'
import getPathFromObject from './getPathFromObject.js'

export default (object) => {
  return new Promise((resolve, reject) => {
    const path = getPathFromObject(object)
    if (path.length > 0) {
      app.localDb.get('_local/paths')
        .then((doc) => {
          doc.paths[path] = object._id
          app.localDb.put(doc)
            .then(() => resolve(doc.paths))
            .catch((error) =>
              reject('changePathOfObjectInLocalDb.js: error writing paths to localDb:', error)
            )
        })
        .catch((error) =>
          reject('changePathOfObjectInLocalDb.js: error getting paths from localDb:', error)
        )
    } else {
      reject('changePathOfObjectInLocalDb.js: object has no path')
    }
  })
}
