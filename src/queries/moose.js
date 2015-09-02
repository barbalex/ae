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
      _id: '_design/moose',
      views: {
        moose: {
          map: function mapFun (doc) {
            if (doc.Typ && doc.Typ === 'Objekt' && doc.Gruppe && doc.Gruppe === 'Moose') {
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
      .then((response) => {
        return app.localDb.query('moose', { include_docs: true })
      })
      .then((result) => {
        const moose = _.pluck(result.rows, 'doc')
        resolve(moose)
      })
      .catch((error) => reject(error))
  })
}
