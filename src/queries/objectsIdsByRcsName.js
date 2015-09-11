/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns a list of guids of relation collections
 * that contain the pc with the name
 * no es6 in ddocs!
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default (name) => {
  return new Promise((resolve, reject) => {
    const ddoc = {
      _id: '_design/objectsIdsByRcsName',
      views: {
        'objectsIdsByRcsName': {
          map: function (doc) {
            if (doc.Typ && doc.Typ === 'Objekt') {
              if (doc.Beziehungssammlungen) {
                doc.Beziehungssammlungen.forEach(function (rc) {
                  emit(rc.Name, doc._id)
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
        return app.localDb.query('objectsIdsByRcsName', options)
      })
      .then((result) => {
        const ids = _.pluck(result.rows, 'id')
        resolve(ids)
      })
      .catch((error) => reject(error))
  })
}
