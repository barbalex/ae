/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns a list of guids of relation collections
 * that contain the pc with the name
 *
 * no es6 in ddocs!
 */

import app from 'ampersand-app'
import { map as _map } from 'lodash'

const ddoc = {
  _id: '_design/objectsIdsByRcsName',
  views: {
    objectsIdsByRcsName: {
      map: function(doc) {
        if (
          doc.Typ &&
          doc.Typ === 'Objekt' &&
          doc.Beziehungssammlungen
        ) {
          doc.Beziehungssammlungen.forEach(function(rc) {
            emit(rc.Name, doc._id)
          })
        }
      }.toString()
    }
  }
}

export default (name) => {
  const queryOptions = {
    key: name
  }

  return new Promise((resolve, reject) => {
    app.remoteDb.query('objectsIdsByRcsName', queryOptions)
      .then((result) => {
        const ids = _map(result.rows, 'id')
        resolve(ids)
      })
      .catch((error) => reject(error))
  })
}
