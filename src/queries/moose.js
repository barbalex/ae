/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default function (options) {
  return new Promise(function (resolve, reject) {
    const ddoc = {
      _id: '_design/moose',
      views: {
        moose: {
          map: function mapFun (doc) {
            if (doc.Typ && doc.Typ === 'Objekt' && doc.Gruppe && doc.Gruppe === 'Moose') {
              emit([doc._id, doc._rev])
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
        console.log('moose.js: response from putting ddoc', response)
        return app.localDb.query('moose', options)
      })
      .then(function (result) {
        console.log('moose.js: result', result)
        const moose = _.pluck(result, 'rows')
        console.log('moose.js: moose', moose)
        resolve(moose)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
