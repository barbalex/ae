'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default function () {
  return new Promise(function (resolve, reject) {
    app.localHierarchyDb.allDocs({include_docs: true})
      .then(function (result) {
        const hierarchy = result.rows.map(function (row) {
          return row.doc
        })
        resolve(_.pluck(hierarchy, 'Name'))
      })
      .catch(function (error) {
        console.log('objectStore, groupsLoaded: error getting items from localHierarchyDb:', error)
        resolve([])
      })
  })
}
