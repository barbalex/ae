'use strict'

import getPaths from './getPaths.js'

export default function (path) {
  const pathString = path.join('/')
  return new Promise(function (resolve, reject) {
    if (!pathString) {
      reject('objectStore, getPath: no pathString passed')
    }
    getPaths()
      .then(function (paths) {
        const guid = paths[pathString]
        resolve(guid)
      })
      .catch(function (error) {
        reject('objectStore, getPath: error getting path:', error)
      })
  })
}
