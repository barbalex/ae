/*
 * gets a path
 * returns the object or undefined
 */

import app from 'ampersand-app'
import isGuid from './isGuid.js'
import replaceProblematicPathCharactersFromArray from './replaceProblematicPathCharactersFromArray.js'
import getGuidFromPath from './getGuidFromPath.js'

export default (path) => new Promise((resolve, reject) => {
  // check if a guidPath was passed
  const isGuidPath = path.length === 1 && isGuid(path[0])
  if (isGuidPath) {
    app.objectStore.getObject(path[0])
      .then((item) => resolve(item))
      .catch((error) =>
        reject(`getObjectFromPath, error getting item for guid ${path[0]}:`, error)
      )
  }

  // check if the pathname equals an object's path
  path = replaceProblematicPathCharactersFromArray(path)
  getGuidFromPath(path)
    .then((guid) => {
      if (guid) {
        app.objectStore.getObject(guid)
          .then((item) => resolve(item))
          .catch((error) =>
            reject(`getObjectFromPath, error getting item for guid ${guid}:`, error)
          )
      } else {
        resolve(null)
      }
    })
    .catch((error) =>
      reject('getObjectFromPath, error getting path from objectStore:', error)
    )
})
