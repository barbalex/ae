/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default function () {
  return new Promise(function (resolve, reject) {
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
      .catch(function (error) {
        // ignore if doc already exists
        if (error.status !== 409) reject(error)
      })
      .then(function (response) {
        return app.localDb.query('fauna', { include_docs: true })
      })
      .then(function (result) {
        const fauna = _.pluck(result.rows, 'doc')
        resolve(fauna)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
