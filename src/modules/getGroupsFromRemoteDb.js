import keyBy from 'lodash/keyBy'

export default (remoteDb) =>
  new Promise((resolve, reject) => {
    if (!remoteDb) {
      reject('getGroupsFromRemoteDb.js: no remoteDb passed')
    }
    remoteDb.query('groups', { include_docs: true })
      .then((result) => {
        // build format wanted for store
        const docs = result.rows.map((row) => row.doc)
        const groups = keyBy(docs, 'Name')
        resolve(groups)
      })
      .catch((error) =>
        reject('getGroupsFromRemoteDb.js, error getting groups from remote remoteDb:', error)
      )
  })
