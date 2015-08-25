'use strict'

import getPathsFromLocalPathDb from './getPathsFromLocalPathDb.js'

export default function (path) {
  // console.log('path', path)
  const pathString = path.join('/')
  return new Promise(function (resolve, reject) {
    if (!pathString) {
      reject('objectStore, getPath: no pathString passed')
    }
    getPathsFromLocalPathDb()
      .then(function (paths) {
        // console.log('paths', paths)
        const guid = paths[pathString]
        // console.log('guid', guid)
        resolve(guid)
      })
      .catch(function (error) {
        reject('objectStore, getPath: error getting path:', error)
      })
  })
}
