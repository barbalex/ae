'use strict'

import app from 'ampersand-app'

export default function () {
  return new Promise(function (resolve, reject) {
    app.localHierarchyDb.allDocs({include_docs: true})
      .then(function (result) {
        const hierarchy = result.rows.map(function (row) {
          return row.doc
        })
        resolve(hierarchy)
      })
      .catch(function (error) {
        console.log('getHierarchyFromLocalHierarchyDb.js: error getting items from localHierarchyDb:', error)
        reject(error)
      })
  })
}
