'use strict'

import app from 'ampersand-app'

export default () => {
  return new Promise((resolve, reject) => {
    app.localHierarchyDb.allDocs({include_docs: true})
      .then((result) => {
        const hierarchy = result.rows.map((row) => row.doc)
        resolve(hierarchy)
      })
      .catch((error) => reject('getHierarchyFromLocalHierarchyDb.js: error getting items from localHierarchyDb: ' + error))
  })
}
