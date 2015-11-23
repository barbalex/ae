/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns a list of guids of property collections
 * that contain the pc with the name
 *
 * if offlineIndexes is true: queries from remote and does not create design doc
 * 
 * no es6 in ddocs!
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

const ddoc = {
  _id: '_design/objectsIdsByPcsName',
  views: {
    'objectsIdsByPcsName': {
      map: function (doc) {
        if (doc.Typ && doc.Typ === 'Objekt' && doc.Eigenschaftensammlungen) {
          doc.Eigenschaftensammlungen.forEach(function (es) {
            emit(es.Name, doc._id)
          })
        }
      }.toString()
    }
  }
}

// TODO: offlineIndexes
export default (name, offlineIndexes) => {
  const queryOptions = {
    key: name
  }
  const query = {
    local () {
      return new Promise((resolve, reject) => {
        app.localDb.put(ddoc)
          .catch((error) => {
            // ignore if doc already exists
            if (error.status !== 409) reject(error)
          })
          .then((response) => app.localDb.query('objectsIdsByPcsName', queryOptions))
          .then((result) => resolve(result))
          .catch((error) => reject(error))
      })
    },
    remote () {
      return new Promise((resolve, reject) => {
        app.remoteDb.query('objectsIdsByPcsName', queryOptions)
          .then((result) => resolve(result))
          .catch((error) => reject(error))
      })
    }
  }
  const db = offlineIndexes ? 'local' : 'remote'

  return new Promise((resolve, reject) => {
    query[db]()
      .then((result) => {
        const ids = _.pluck(result.rows, 'id')
        resolve(ids)
      })
      .catch((error) => reject(error))
  })
}
