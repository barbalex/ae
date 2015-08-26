/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 */

'use strict'

import app from 'ampersand-app'

export default function () {
  return new Promise(function (resolve, reject) {
    const ddoc = {
      _id: '_design/propertyCollections',
      views: {
        'propertyCollections': {
          map: function (doc) {
            if (doc.Typ && doc.Typ === 'Objekt') {
              if (doc.Eigenschaftensammlungen) {
                doc.Eigenschaftensammlungen.forEach(function (es) {
                  // esZusammenfassend ergänzen
                  const esZusammenfassend = !!es.zusammenfassend
                  let felder = {}
                  let x
                  for (x in es) {
                    if (x !== 'Typ' && x !== 'Name' && x !== 'Eigenschaften') {
                      felder[x] = es[x]
                    }
                  }
                  emit(['Datensammlung', es.Name, esZusammenfassend, es['importiert von'], felder], doc._id)
                })
              }
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
          startkey: ['Datensammlung'],
          endkey: ['Datensammlung', {}, {}, {}, {}],
          group_level: 5,
          reduce: '_count'
        }
        return app.localDb.query('propertyCollections', options)
      })
      .then(function (result) {
        const propertyCollections = result.rows
        resolve(propertyCollections)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
