/*
 * gets guid
 * returns the full path
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'
import replaceProblematicPathCharactersFromArray from './replaceProblematicPathCharactersFromArray.js'

function extractPayloadFromObject (object) {
  let path = []
  if (object.Taxonomien) {
    const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy['Standardtaxonomie'])
    if (standardtaxonomie && _.has(standardtaxonomie, 'Eigenschaften.Hierarchie')) {
      path = _.pluck(standardtaxonomie.Eigenschaften.Hierarchie, 'Name')
      path = replaceProblematicPathCharactersFromArray(path)
    }
  }
  path.unshift(object.Gruppe)  // hm. this is too much when loading with view per group
  const url = '/' + path.join('/')
  return { path, url }
}

export default (guid) => {
  return new Promise((resolve, reject) => {
    app.objectStore.getItem(guid)
      .then((object) => resolve(extractPayloadFromObject(object)))
      .catch((error) => reject('getPathFromGuid.js: error getting Item from objectStore:', error))
  })
}
