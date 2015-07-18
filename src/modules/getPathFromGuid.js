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

export default function (guid, object) {
  let path = []
  object = object || app.objectStore.items[guid]
  if (_.has(object, 'object.Taxonomien[0].Eigenschaften.Hierarchie')) {
    path = _.pluck(object.Taxonomien[0].Eigenschaften.Hierarchie, 'Name')
    path = replaceProblematicPathCharactersFromArray(path)
  }

  const payload = {
    path: path,
    url: '/' + path.join('/')
  }

  return payload
}
