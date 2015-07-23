'use strict'

import app from 'ampersand-app'

export default function () {
  return new Promise(function (resolve, reject) {
    app.localDb.allDocs({include_docs: true})
      .then(function (result) {
        const items = result.rows.map(function (row) {
          return row.doc
        })
        resolve(items)
      })
      .catch(function (error) {
        console.log('objectStore: error getting items from localDb:', error)
        reject(error)
      })
  })
}
