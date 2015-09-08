/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns a list of guids of property collections
 * that contain the pc with the name
 * no es6 in ddocs!
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default (name) => {
  return new Promise((resolve, reject) => {
    const ddoc = {
      _id: '_design/objectsIdsByPcsName',
      views: {
        'objectsIdsByPcsName': {
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
          key: name
        }
        return app.localDb.query('objectsIdsByPcsName', options)
      })
      .then((result) => {
        const ids = _.pluck(result.rows, 'id')
        resolve(ids)
      })
      .catch((error) => reject(error))
  })
}
