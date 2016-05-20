'use strict'

import getPathsFromLocalDb from './getPathsFromLocalDb.js'

export default (path) => new Promise((resolve, reject) => {
  if (!path) reject('objectStore, getPath: no path passed')
  if (path.length === 0) resolve(null)

  getPathsFromLocalDb()
    .then((paths) => {
      if (!paths) return resolve(null)
      const guid = paths[path.join('/')]
      resolve(guid)
    })
    .catch((error) =>
      reject('objectStore, getPath: error getting path:', error)
    )
})
