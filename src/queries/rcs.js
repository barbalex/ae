/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns an object for every relation collection
 */

import app from 'ampersand-app'
import { uniqBy } from 'lodash'

const ddoc = {
  id: '_design/rcs',
  views: {
    rcs: {
      map: function(doc) {
        if (
          doc.Typ &&
          doc.Typ === 'Objekt' &&
          doc.Beziehungssammlungen
        ) {
          doc.Beziehungssammlungen.forEach(function(rc) {
            // add rcCombining
            var rcCombining = !!rc.zusammenfassend
            var felder = {}
            Object.keys(rc).forEach(function(key) {
              if (key !== 'Typ' && key !== 'Name' && key !== 'Eigenschaften') {
                felder[key] = rc[key]
              }
            })
            emit(
              [rc.Name, rcCombining, rc['Organisation mit Schreibrecht'], felder],
              null
            )
          })
        }
      }.toString(),
      reduce: '_count'
    }
  }
}

// don't understand why but passing reduce
// produces an error in couch
const queryOptions = {
  group_level: 4
}

export default () =>
  new Promise((resolve, reject) => {
    app.remoteDb.query('rcs', queryOptions)
      .then((result) => {
        const rows = result.rows
        const uniqueRows = uniqBy(rows, (row) => row.key[0])
        let rcs = uniqueRows.map((row) => ({
          name: row.key[0],
          combining: row.key[1],
          organization: row.key[2],
          fields: row.key[3],
          count: row.value
        }))
        // sort by rcName
        rcs = rcs.sort((rc) => rc.name)
        resolve(rcs)
      })
      .catch((error) => reject(error))
  })
