/*
 * gets an array of guids
 * returns their docs
 */

'use strict'

import app from 'ampersand-app'

export default (ids) => {
  return new Promise((resolve, reject) => {
    const options = {
      keys: ids
    }
    app.localDb.allDocs(options)
      .then((result) => {
        let returnObject = {}
        result.rows.forEach((row) => {
          returnObject[row.id] = row.id
        })
        resolve(returnObject)
      })
      .catch((error) => reject('error fetching docs', error))
  })
}
