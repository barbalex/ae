/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options, passing an array of ids (Taxonomie ID)
 * emits the Taxonomie ID as key and guid as value
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default function (ids) {
  return new Promise(function (resolve, reject) {
    const ddoc = {
      _id: '_design/faunaById',
      views: {
        'faunaById': {
          map: function (doc) {
            if (doc.Typ && doc.Typ === 'Objekt' && doc.Gruppe && doc.Gruppe === 'Fauna') {
              emit(doc.Taxonomien[0].Eigenschaften['Taxonomie ID'], doc._id)
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
        const options = {
          keys: ids,
          include_docs: true
        }
        return app.localDb.query('faunaById', options)
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
