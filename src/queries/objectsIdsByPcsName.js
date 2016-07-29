/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns a list of guids of property collections
 * that contain the pc with the name
 *
 * no es6 in ddocs!
 */

import app from 'ampersand-app'
import { map as _map } from 'lodash'

const ddoc = {
  id: '_design/objectsIdsByPcsName',
  views: {
    objectsIdsByPcsName: {
      map: function(doc) {
        if (
          doc.Typ &&
          doc.Typ === 'Objekt' &&
          doc.Eigenschaftensammlungen
        ) {
          doc.Eigenschaftensammlungen.forEach(function(es) {
            emit(es.Name, doc.id)
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
    app.remoteDb.query('objectsIdsByPcsName', queryOptions)
      .then((result) => {
        const ids = _map(result.rows, 'id')
        resolve(ids)
      })
      .catch((error) => reject(error))
  })
}
