/*
 * momentarily not in use
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default () => {
  return new Promise((resolve, reject) => {
    app.localHierarchyDb.allDocs({include_docs: true})
      .then((result) => {
        const hierarchy = result.rows.map((row) => row.doc)
        resolve(_.pluck(hierarchy, 'Name'))
      })
      .catch((error) => reject('getGroupsLoadedFromHierarchy: error getting items from localHierarchyDb:', error))
  })
}
