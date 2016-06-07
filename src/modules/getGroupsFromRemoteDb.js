'use strict'

import app from 'ampersand-app'

export default (remoteDb) => new Promise((resolve, reject) => {
  if (!remoteDb) {
    return reject('getGroupsFromRemoteDb.js: no remoteDb passed')
  }
  app.remoteDb.query('groups', { include_docs: true })
    .then((result) => {
      const groups = result.rows.map((row) => row.doc)
      resolve(groups)
    })
    .catch((error) =>
      reject('getGroupsFromRemoteDb.js, error getting groups from remote remoteDb:', error)
    )
})
