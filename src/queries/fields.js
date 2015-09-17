/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns a key and value for every object
 * key: doc.Gruppe, 'Datensammlung', datensammlung.Name, feldname, typeof feldwert
 * value: _count
 * no es6 in ddocs!
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default () => {
  return new Promise((resolve, reject) => {
    const ddoc = {
      _id: '_design/fields',
      views: {
        'fields': {
          map: function (doc) {
            if (doc.Gruppe && doc.Typ && doc.Typ === 'Objekt') {

              if (doc.Taxonomien && doc.Taxonomien[0] && doc.Taxonomien[0].Eigenschaften) {
                var eigenschaften = doc.Taxonomien[0].Eigenschaften
                Object.keys(eigenschaften).forEach(function (feldname) {
                  var feldwert = eigenschaften[feldname]
                  emit([doc.Gruppe, 'Taxonomie', doc.Taxonomie.Name, feldname, typeof feldwert], doc._id)
                })
              }

              if (doc.Eigenschaftensammlungen) {
                doc.Eigenschaftensammlungen.forEach(function (datensammlung) {
                  if (datensammlung.Eigenschaften) {
                    var eigenschaften = datensammlung.Eigenschaften
                    Object.keys(eigenschaften).forEach(function (feldname) {
                      var feldwert = eigenschaften[feldname]
                      emit([doc.Gruppe, 'Datensammlung', datensammlung.Name, feldname, typeof feldwert], doc._id)
                    })
                  }
                })
              }

              if (doc.Beziehungssammlungen && doc.Beziehungssammlungen.length > 0) {
                doc.Beziehungssammlungen.forEach(function (beziehungssammlung) {
                  if (beziehungssammlung.Beziehungen && beziehungssammlung.Beziehungen.length > 0) {
                    beziehungssammlung.Beziehungen.forEach(function (beziehung) {
                      Object.keys(beziehung).forEach(function (feldname) {
                        var feldwert = beziehung[feldname]
                        // irgendwie liefert dieser Loop auch Zahlen, die aussehen als wären sie die keys eines Arrays. Ausschliessen
                        if (isNaN(parseInt(feldname, 10))) {
                          // jetzt loopen wir durch die Daten der Beziehung
                          emit([doc.Gruppe, 'Beziehung', beziehungssammlung.Name, feldname, typeof feldwert], doc._id)
                        }
                      })
                    })
                  }
                })
              }

            }
          }.toString(),
          reduce: '_count'
        }
      }
    }

    app.localDb.put(ddoc)
      .catch((error) => {
        // ignore if doc already exists
        if (error.status !== 409) reject(error)
      })
      .then((response) => {
        console.log('fields: response from putting ddoc')
        const options = {
          group_level: 5,
          reduce: '_count'
        }
        return app.localDb.query('fields', options)
      })
      .then((result) => {
        console.log('fields.js, result', result)
        const rows = result.rows
        let fields = rows.map((row) => ({
          group: row.key[0],
          cType: row.key[1],
          cName: row.key[2],
          fName: row.key[3],
          fType: row.key[4],
          count: row.value
        }))
        // sort by pcName
        fields = _.sortBy(fields, (field) => [field.cName, field.field])
        resolve(fields)
      })
      .catch((error) => reject(error))
  })
}
