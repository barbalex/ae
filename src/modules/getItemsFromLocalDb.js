'use strict'

import app from 'ampersand-app'

export default () => {
  return new Promise((resolve, reject) => {
    console.log('getItemsFromLocalDb.js, fetching items')
    app.localDb.allDocs({include_docs: true})
      .then((result) => {
        const items = result.rows.map((row) => row.doc)
        console.log('getItemsFromLocalDb.js, returning items')
        resolve(items)
      })
      .catch((error) => reject('objectStore: error getting items from localDb:', error))
  })
}
