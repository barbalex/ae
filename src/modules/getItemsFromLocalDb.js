import app from 'ampersand-app'

export default () => new Promise((resolve, reject) => {
  app.localDb.allDocs({ include_docs: true })
    .then((result) => {
      const items = result.rows.map((row) => row.doc)
      resolve(items)
    })
    .catch((error) =>
      reject('objectStore: error getting items from localDb:', error)
    )
})
