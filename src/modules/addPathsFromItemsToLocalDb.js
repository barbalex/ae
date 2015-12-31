/*
 * gets new objects passed
 * generates their paths
 * and adds them to localDb
 */

'use strict'

import app from 'ampersand-app'
import getPathFromObject from './getPathFromObject.js'

export default (objects) => {
  return new Promise((resolve, reject) => {
    // build paths of passed in objects (usually: objects of a group)
    const pathsOfGruppe = {}
    objects.forEach((object) => {
      // get hierarchy from the Hierarchie field
      // default value (in case there is none) is []
      const path = getPathFromObject(object)
      // if path is [] make sure no path is added
      if (path.length > 0) pathsOfGruppe[path] = object._id
    })

    // console.log('addPathsFromItemsToLocalDb.js, paths of gruppe ' + objects[0].Gruppe, pathsOfGruppe)

    // combine these paths with those already in pathDb
    app.localDb.get('_local/paths', (error, doc) => {
      if (error) {
        if (error.status === 404) {
          // leave paths as it is
          console.log('error getting _local/paths', error)
        } else {
          reject('addPathsFromItemsToLocalDb.js: error getting paths from localDb:', error)
        }
      }
      doc.paths = Object.assign(doc.paths, pathsOfGruppe)
      app.localDb.put(doc)
        .then(() => resolve(doc.paths))
        .catch((error) => reject('addPathsFromItemsToLocalDb.js: error writing paths to localDb:', error)
      )
    })
  })
}
