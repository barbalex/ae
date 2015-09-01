/*
 * gets an array of guids
 * returns their docs
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default function (ids) {
  return new Promise(function (resolve, reject) {
    const options = {
      keys: ids,
      include_docs: true
    }
    app.localDb.allDocs(options)
      .then(function (result) {
        const docs = _.pluck(result.rows, 'doc')
        resolve(docs)
      })
      .catch(function (error) {
        reject('error fetching docs', error)
      })
  })
}
