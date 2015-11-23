/*
 * gets new items passed
 * generates their paths
 * and adds them to localPathDb
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'
import replaceProblematicPathCharactersFromArray from './replaceProblematicPathCharactersFromArray.js'

export default (items) => {
  return new Promise((resolve, reject) => {
    let paths = {_id: 'aePaths'}

    // build paths of passed in items (usually: items of a group)
    const pathsOfGruppe = {}
    items.forEach((item) => {
      // get hierarchy from the Hierarchie field
      // default value (in case there is none) is []
      const standardtaxonomie = item.Taxonomien.find((taxonomy) => taxonomy['Standardtaxonomie'])
      const hierarchy = standardtaxonomie ? _.get(standardtaxonomie, 'Eigenschaften.Hierarchie', []) : []
      let path = _.pluck(hierarchy, 'Name')
      // if path is [] make shure no path is added
      if (path.length > 0) {
        path = replaceProblematicPathCharactersFromArray(path).join('/')
        pathsOfGruppe[path] = item._id
      }
    })

    // combine these paths with those already in pathDb
    app.localPathDb.get('aePaths', (error, pathsFromDb) => {
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
      paths = Object.assign(paths, pathsOfGruppe)
      app.localPathDb.put(paths)
        .then(() => resolve(paths))
        .catch((error) =>
          reject('addPathsFromItemsToLocalPathDb.js: error writing paths to localPathDb:', error)
        )
    })
  })
}
