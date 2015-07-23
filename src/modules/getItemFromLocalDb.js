'use strict'

import app from 'ampersand-app'

export default function (guid) {
  return new Promise(function (resolve, reject) {
    if (!guid) {
      reject('objectStore, getItem: no guid passed')
    }
    app.localDb.get(guid)
      .then(function (item) {
        resolve(item)
      })
      .catch(function (error) {
        reject('objectStore: error getting item from localDb:', error)
      })
  })
}
