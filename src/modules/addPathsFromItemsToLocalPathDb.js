'use strict'

import app from 'ampersand-app'
import _ from 'lodash'
import replaceProblematicPathCharactersFromArray from './replaceProblematicPathCharactersFromArray.js'

export default function (items) {
  return new Promise(function (resolve, reject) {
    let paths = {_id: 'aePaths'}

    // build paths of passed in items (usually: items of a group)
    const pathsOfGruppe = {}
    _.forEach(items, function (item) {
      const hierarchy = _.get(item, 'Taxonomien[0].Eigenschaften.Hierarchie', [])
      let path = _.pluck(hierarchy, 'Name')
      // path.unshift(item.Gruppe)
      path = replaceProblematicPathCharactersFromArray(path).join('/')
      pathsOfGruppe[path] = item._id
    })

    // combine these paths with those already in pathDb
    app.localPathDb.get('aePaths', function (error, pathsFromDb) {
      if (error) {
        if (error.status === 404) {
          // leave paths as it is
        } else {
          reject('addPathsFromItemsToLocalPathDb.js: error getting paths from localPathDb:', error)
        }
      } else {
        // there existed already a path object
        // combine them
        paths = pathsFromDb
      }
      _.assign(paths, pathsOfGruppe)
      app.localPathDb.put(paths)
        .then(function () {
          resolve(paths)
        })
        .catch(function (error) {
          reject('addPathsFromItemsToLocalPathDb.js: error writing paths to localPathDb:', error)
        })
    })
  })
}
