/*
 * gets a path
 * returns the object or undefined
 */

'use strict'

import app from 'ampersand-app'
import isGuid from './isGuid.js'
import replaceProblematicPathCharactersFromArray from './replaceProblematicPathCharactersFromArray.js'

export default function (path) {
  return new Promise(function (resolve, reject) {
    // check if a guidPath was passed
    const isGuidPath = path.length === 1 && isGuid(path[0])
    if (isGuidPath) {
      app.objectStore.getItem(path[0])
        .then(function (item) {
          resolve(item)
        })
        .catch(function (error) {
          reject('getObjectFromPath, error getting item for guid ' + path[0] + ':', error)
        })
    }

    // check if the pathname equals an object's path
    path = replaceProblematicPathCharactersFromArray(path)
    app.objectStore.getPath(path.join('/'))
      .then(function (guid) {
        if (guid) {
          app.objectStore.getItem(guid)
            .then(function (item) {
              resolve(item)
            })
            .catch(function (error) {
              reject('getObjectFromPath, error getting item for guid ' + guid + ':', error)
            })
        }
        reject('getObjectFromPath: no GUID')
      })
      .catch(function (error) {
        reject('getObjectFromPath, error getting path from objectStore:', error)
      })
  })
}
