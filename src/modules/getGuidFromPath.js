'use strict'

import getPathsFromLocalPathDb from './getPathsFromLocalPathDb.js'

export default (path) => {
  const pathString = path.join('/')
  return new Promise((resolve, reject) => {
    if (!pathString) reject('objectStore, getPath: no pathString passed')
    getPathsFromLocalPathDb()
      .then((paths) => {
        const guid = paths[pathString]
        resolve(guid)
      })
      .catch((error) => reject('objectStore, getPath: error getting path:', error))
  })
}
