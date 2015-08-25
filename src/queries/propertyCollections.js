/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default function (options) {
  return new Promise(function (resolve, reject) {
    const propertyCollections = []
    const ddoc = {
      _id: '_design/propertyCollections',
      views: {
        map: function (doc) {
          let x
          if (doc.Typ && doc.Typ === 'Objekt') {
            if (doc.Eigenschaftensammlungen) {
              _.each(doc.Eigenschaftensammlungen, function (es) {
                // dsZusammenfassend ergänzen
                const dsZusammenfassend = !!es.zusammenfassend
                let felder = {}
                for (x in es) {
                  if (x !== 'Typ' && x !== 'Name' && x !== 'Eigenschaften') {
                    felder[x] = es[x]
                  }
                }
                emit(['Datensammlung', es.Name, dsZusammenfassend, es['importiert von'], felder], doc._id)
              })
            }
          }
        }.toString()
      }
    }
    app.localDb.put(ddoc)
      .catch(function (error) {
        // ignore if doc already exists
        if (error.status !== 409) reject(error)
      })
      .then(function () {
        return app.localDb.query('propertyCollections', options)
      })
      .then(function (result) {
        propertyCollections = _.pluck(result, 'row')
        resolve(propertyCollections)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
