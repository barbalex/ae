/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options, passing an array of ids (Taxonomie ID)
 * emits the Taxonomie ID as key and guid as value
 *
 * if offlineIndexes is true: queries from remote and does not create design doc
 *
 * no es6 in ddocs!
 */

'use strict'

import app from 'ampersand-app'

const ddoc = {
  _id: '_design/mooseById',
  views: {
    'mooseById': {
      map: function (doc) {
        if (doc.Typ && doc.Typ === 'Objekt' && doc.Gruppe && doc.Gruppe === 'Moose') {
          emit(doc.Taxonomien[0].Eigenschaften['Taxonomie ID'], null)
        }
      }.toString()
    }
  }
}

export default (ids) => {
  const queryOptions = {
    keys: ids
  }
  const query = {
    local () {
      return new Promise((resolve, reject) => {
        app.localDb.put(ddoc)
          .catch((error) => {
            // ignore if doc already exists
            if (error.status !== 409) reject(error)
          })
          .then((response) => app.localDb.query('mooseById', queryOptions))
          .then((result) => resolve(result))
          .catch((error) => reject(error))
      })
    },
    remote () {
      return new Promise((resolve, reject) => {
        app.remoteDb.query('artendb/aeLMooseById', queryOptions)
          .then((result) => resolve(result))
          .catch((error) => reject(error))
      })
    }
  }
  const db = offlineIndexes ? 'local' : 'remote'

  return new Promise((resolve, reject) => {
    query[db]()
      .then((result) => {
        let returnObject = {}
        result.rows.forEach((row) => {
          returnObject[row.key] = row.id
        })
        resolve(returnObject)
      })
      .catch((error) => reject(error))
  })
}
