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
  if (_.has(object, 'Taxonomien[0].Eigenschaften.Hierarchie')) {
    path = _.pluck(object.Taxonomien[0].Eigenschaften.Hierarchie, 'Name')
    path = replaceProblematicPathCharactersFromArray(path)
  }
  path.unshift(object.Gruppe)  // hm. this is too much when loading with view per group
  const payload = {
    path: path,
    url: '/' + path.join('/')
  }
  return payload
}

export default (guid) => {
  return new Promise((resolve, reject) => {
    app.objectStore.getItem(guid)
      .then((object) => resolve(extractPayloadFromObject(object)))
      .catch((error) => reject('getPathFromGuid.js: error getting Item from objectStore:', error))
  })
}
