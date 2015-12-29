/*
 * gets an item passed
 * generates its path
 * and updates it in localPathDb
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
    if (path.length > 0) path = replaceProblematicPathCharactersFromArray(path).join('/')
    app.localPathDb.get('aePaths')
      .then((paths) => {
        paths[path] = item._id
        app.localPathDb.put(paths)
          .then(() => resolve(paths))
          .catch((error) =>
            reject('addPathsFromItemsToLocalPathDb.js: error writing paths to localPathDb:', error)
          )
      })
      .catch((error) =>
        reject('addPathsFromItemsToLocalPathDb.js: error getting paths from localPathDb:', error)
      )
  })
}
