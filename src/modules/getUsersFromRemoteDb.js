export default (remoteUsersDb) =>
  new Promise((resolve, reject) => {
    if (!remoteUsersDb) {
      reject('getUsersFromRemoteDb.js: no remoteUsersDb passed')
    }
    remoteUsersDb.query('users', { include_docs: true })
      .then((result) => {
        // build format wanted for store
        const users = result.rows.map((row) =>
          row.doc.id.replace('org.couchdb.user:', '')
        )
        resolve(users)
      })
      .catch((error) =>
        reject('getUsersFromRemoteDb.js, error getting users from remote remoteUsersDb:', error)
      )
  })
