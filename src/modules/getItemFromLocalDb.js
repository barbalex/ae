'use strict'

import app from 'ampersand-app'

export default function (guid) {
  return new Promise(function (resolve, reject) {
    if (!guid) {
      reject('getItemFromLocalDb, getItem: no guid passed')
    }
    app.localDb.get(guid)
      .then(function (item) {
        resolve(item)
      })
      .catch(function (error) {
        // when the object is not found, return null
        // so the item can be fetched from remote instead
        if (error.status === 404) resolve(null)
        reject('getItemFromLocalDb: error getting item from localDb:', error)
      })
  })
}
