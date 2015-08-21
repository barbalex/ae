/*
 * gets guid
 * returns the full path
 * if path is requested for an object whose group is not loaded in the store
 * object is passed in too
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

export default function (guid) {
  return new Promise(function (resolve, reject) {
    app.objectStore.getItem(guid)
      .then(function (object) {
        resolve(extractPayloadFromObject(object))
      })
      .catch(function (error) {
        reject('getPathFromGuid.js: error getting Item from objectStore:', error)
      })
  })
}
