'use strict'

import getPathsFromLocalPathDb from './getPathsFromLocalPathDb.js'

export default (path) => {
  const pathString = path.join('/')

  return new Promise((resolve, reject) => {
    if (!path) reject('objectStore, getPath: no path passed')
    if (path.length === 0) resolve(null)
    getPathsFromLocalPathDb()
      .then((paths) => {
        if (!paths) return resolve(null)
        const guid = paths[pathString]
        resolve(guid)
      })
      .catch((error) => reject('objectStore, getPath: error getting path:', error))
  })
}
