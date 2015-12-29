/*
 * gets an item passed
 * generates its path
 * and updates it in localDb
 */

'use strict'

import app from 'ampersand-app'
import { get, pluck } from 'lodash'
import replaceProblematicPathCharactersFromArray from './replaceProblematicPathCharactersFromArray.js'

export default (item) => {
  return new Promise((resolve, reject) => {
    const standardtaxonomie = item.Taxonomien.find((taxonomy) => taxonomy['Standardtaxonomie'])
    const hierarchy = standardtaxonomie ? get(standardtaxonomie, 'Eigenschaften.Hierarchie', []) : []
    let path = pluck(hierarchy, 'Name')
    let paths = []
    if (path.length > 0) path = replaceProblematicPathCharactersFromArray(path).join('/')
    app.localDb.get('_local/paths')
      .then((doc) => {
        doc.paths[path] = item._id
        paths = doc.paths
        app.localDb.put(doc)
          .then(() => resolve(paths))
          .catch((error) =>
            reject('addPathsFromItemsToLocalDb.js: error writing paths to localDb:', error)
          )
      })
      .catch((error) =>
        reject('addPathsFromItemsToLocalDb.js: error getting paths from localDb:', error)
      )
  })
}
