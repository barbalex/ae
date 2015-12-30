/*
 * gets new items passed
 * generates their paths
 * and adds them to localDb
 */

'use strict'

import app from 'ampersand-app'
import { get, pluck } from 'lodash'
import replaceProblematicPathCharactersFromArray from './replaceProblematicPathCharactersFromArray.js'

export default (items) => {
  return new Promise((resolve, reject) => {
    // build paths of passed in items (usually: items of a group)
    const pathsOfGruppe = {}
    items.forEach((item) => {
      // get hierarchy from the Hierarchie field
      // default value (in case there is none) is []
      const standardtaxonomie = item.Taxonomien.find((taxonomy) => taxonomy['Standardtaxonomie'])
      const hierarchy = standardtaxonomie ? get(standardtaxonomie, 'Eigenschaften.Hierarchie', []) : []
      let path = pluck(hierarchy, 'Name')
      // if path is [] make shure no path is added
      if (path.length > 0) {
        /**
         * I have no idea when Gruppe is included in path
         * if I add it it is usually doubly included
         * if I dont add it it usually isnt there
         * so only add it if not already included
         */
        if (path[0] !== item.Gruppe) path.unshift(item.Gruppe)
        path = replaceProblematicPathCharactersFromArray(path).join('/')
        pathsOfGruppe[path] = item._id
      }
    })

    console.log('addPathsFromItemsToLocalDb.js, paths of gruppe ' + items[0].Gruppe, pathsOfGruppe)

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
