/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * no es6 in ddocs!
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default () => {
  return new Promise((resolve, reject) => {
    const ddoc = {
      _id: '_design/fauna',
      views: {
        'fauna': {
          map: function (doc) {
            if (doc.Typ && doc.Typ === 'Objekt' && doc.Gruppe && doc.Gruppe === 'Fauna') {
              emit([doc._id, doc._rev])
            }
          }.toString()
        }
      }
    }

    app.localDb.put(ddoc)
      .catch((error) => {
        // ignore if doc already exists
        if (error.status !== 409) reject(error)
      })
      .then((response) => app.localDb.query('fauna', { include_docs: true }))
      .then((result) => {
        const fauna = _.pluck(result.rows, 'doc')
        resolve(fauna)
      })
      .catch((error) => reject(error))
  })
}
