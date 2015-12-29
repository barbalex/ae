'use strict'

import app from 'ampersand-app'

export default (guid) => {
  return new Promise((resolve, reject) => {
    if (!guid) {
      reject('getItemFromLocalDb, getObject: no guid passed')
    }
    app.localDb.get(guid)
      .then((item) => resolve(item))
      .catch((error) => {
        // when the object is not found, return null
        // so the item can be fetched from remote instead
        if (error.status === 404) resolve(null)
        reject('getItemFromLocalDb: error getting item from localDb:', error)
      })
  })
}
