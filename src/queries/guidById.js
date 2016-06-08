/*
 * gets an array of guids
 * returns their docs
 * allways gets docs from local because allDocs is fast
 */

import app from 'ampersand-app'

export default (ids) =>
  new Promise((resolve, reject) => {
    const options = {
      keys: ids
    }
    app.localDb.allDocs(options)
      .then((result) => {
        const returnObject = {}
        result.rows.forEach((row) => {
          returnObject[row.id] = row.id
        })
        resolve(returnObject)
      })
      .catch((error) =>
        reject('error fetching docs', error)
      )
  })
