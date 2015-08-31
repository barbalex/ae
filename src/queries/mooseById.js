/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options, passing an array of ids (Taxonomie ID)
 * emits the Taxonomie ID as key and guid as value
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default function (ids) {
  // first make shure the ids are converted to numbers
  ids = ids.map(function (id) {
    return parseInt(id, 10)
  })
  console.log('mooseById, ids', ids)
  return new Promise(function (resolve, reject) {
    const ddoc = {
      _id: '_design/mooseById',
      views: {
        'mooseById': {
          map: function (doc) {
            if (doc.Typ && doc.Typ === 'Objekt' && doc.Gruppe && doc.Gruppe === 'Moose') {
              emit(doc['Taxonomie ID'], doc._id)
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
        console.log('mooseById, response from put ddoc', response)
        const options = {
          keys: ids,
          include_docs: true
        }
        return app.localDb.query('mooseById', options)
      })
      .then(function (result) {
        console.log('mooseById, result from query', result)
        const moose = _.pluck(result.rows, 'doc')
        resolve(moose)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
