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

const ddoc = {
  _id: '_design/fieldsOfGroup',
  views: {
    'fieldsOfGroup': {
      map: function (doc) {
        if (doc.Gruppe && doc.Typ && doc.Typ === 'Objekt' && doc.Taxonomien) {
          const standardtaxonomie = doc.Taxonomien.find((taxonomy) => taxonomy['Standardtaxonomie'])
          if (standardtaxonomie && standardtaxonomie.Eigenschaften) {
            const eigenschaften = standardtaxonomie.Eigenschaften
            Object.keys(eigenschaften).forEach((feldname) => {
              const feldwert = eigenschaften[feldname]
              emit([doc.Gruppe, 'taxonomy', doc.Taxonomie.Name, feldname, typeof feldwert], doc._id)
            })
          }

          if (doc.Eigenschaftensammlungen) {
            doc.Eigenschaftensammlungen.forEach((pc) => {
              if (pc.Eigenschaften) {
                const eigenschaften = pc.Eigenschaften
                Object.keys(eigenschaften).forEach((feldname) => {
                  const feldwert = eigenschaften[feldname]
                  emit([doc.Gruppe, 'propertyCollection', pc.Name, feldname, typeof feldwert], doc._id)
                })
              }
            })
          }

          if (doc.Beziehungssammlungen && doc.Beziehungssammlungen.length > 0) {
            doc.Beziehungssammlungen.forEach((beziehungssammlung) => {
              if (beziehungssammlung.Beziehungen && beziehungssammlung.Beziehungen.length > 0) {
                beziehungssammlung.Beziehungen.forEach((beziehung) => {
                  Object.keys(beziehung).forEach((feldname) => {
                    const feldwert = beziehung[feldname]
                    // irgendwie liefert dieser Loop auch Zahlen, die aussehen als wären sie die keys eines Arrays. Ausschliessen
                    if (isNaN(parseInt(feldname, 10))) {
                      // jetzt loopen wir durch die Daten der Beziehung
                      emit([doc.Gruppe, 'relation', beziehungssammlung.Name, feldname, typeof feldwert], doc._id)
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

export default (group, offlineIndexes) => {
  return new Promise((resolve, reject) => {
    const queryOptions = {
      group_level: 5,
      start_key: [group],
      end_key: [group, {}, {}, {}, {}],
      reduce: '_count'
    }
    // don't understand why but passing reduce
    // produces an error in couch
    const queryOptionsCouch = {
      group_level: 5,
      start_key: [group],
      end_key: [group, {}, {}, {}, {}]
    }
    const query = {
      local () {
        return new Promise((resolve, reject) => {
          app.localDb.put(ddoc)
            .catch((error) => {
              // ignore if doc already exists
              if (error.status !== 409) reject(error)
            })
            .then((response) => app.localDb.query('fieldsOfGroup', queryOptions))
            .then((result) => resolve(result))
            .catch((error) => reject(error))
        })
      },
      remote () {
        return new Promise((resolve, reject) => {
          app.remoteDb.query('fieldsOfGroup', queryOptionsCouch)
            .then((result) => resolve(result))
            .catch((error) => reject(error))
        })
      }
    }
    const db = offlineIndexes ? 'local' : 'remote'

    query[db]()
      .then((result) => {
        // console.log('fieldsOfGroup.js, result', result)
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
        fields = _.sortBy(fields, (field) => [field.cName, field.fName])
        resolve(fields)
      })
      .catch((error) => reject(error))
  })
}
