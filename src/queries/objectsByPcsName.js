/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns an object for every property collection
 * no es6 in ddocs!
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default (name) => {
  return new Promise((resolve, reject) => {
    const ddoc = {
      _id: '_design/objectsByPcsName',
      views: {
        'objectsByPcsName': {
          map: function (doc) {
            if (doc.Typ && doc.Typ === 'Objekt') {
              if (doc.Eigenschaftensammlungen) {
                doc.Eigenschaftensammlungen.forEach(function (es) {
                  emit(es.Name, doc._id)
                })
              }
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
        const options = {
          key: name,
          include_docs: true
        }
        return app.localDb.query('objectsByPcsName', options)
      })
      .then((result) => {
        const docs = _.pluck(result.rows, 'doc')
        resolve(docs)
      })
      .catch((error) => reject(error))
  })
}
