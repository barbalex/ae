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
      _id: '_design/fauna',
      views: {
        fauna: {
          map: function mapFun (doc) {
            if (doc.Typ && doc.Typ === 'Objekt' && doc.Gruppe && doc.Gruppe === 'Fauna') {
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
        console.log('fauna.js: response from putting ddoc', response)
        return app.localDb.query('fauna', options)
      })
      .then(function (result) {
        console.log('fauna.js: result', result)
        const fauna = _.pluck(result, 'rows')
        console.log('fauna.js: fauna', fauna)
        resolve(fauna)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
