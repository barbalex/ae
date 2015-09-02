/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options, passing an array of ids (Taxonomie ID)
 * emits the Taxonomie ID as key and guid as value
 * no es6 in ddocs!
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default (ids) => {
  return new Promise((resolve, reject) => {
    const ddoc = {
      _id: '_design/mooseById',
      views: {
        'mooseById': {
          map: function (doc) {
            if (doc.Typ && doc.Typ === 'Objekt' && doc.Gruppe && doc.Gruppe === 'Moose') {
              emit(doc.Taxonomien[0].Eigenschaften['Taxonomie ID'], doc._id)
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
          keys: ids,
          include_docs: true
        }
        return app.localDb.query('mooseById', options)
      })
      .then((result) => {
        const moose = _.pluck(result.rows, 'doc')
        resolve(moose)
      })
      .catch((error) => reject(error))
  })
}
