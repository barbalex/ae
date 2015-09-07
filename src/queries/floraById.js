/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options, passing an array of ids (Taxonomie ID)
 * emits the Taxonomie ID as key and guid as value
 * no es6 in ddocs!
 */

'use strict'

import app from 'ampersand-app'

export default (ids) => {
  return new Promise((resolve, reject) => {
    const ddoc = {
      _id: '_design/floraById',
      views: {
        'floraById': {
          map: function (doc) {
            if (doc.Typ && doc.Typ === 'Objekt' && doc.Gruppe && doc.Gruppe === 'Flora') {
              emit(doc.Taxonomien[0].Eigenschaften['Taxonomie ID'], null)
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
          keys: ids
        }
        return app.localDb.query('floraById', options)
      })
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
