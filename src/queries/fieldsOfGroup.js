/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns a key and value for every object
 * key: doc.Gruppe, 'Datensammlung', datensammlung.Name, feldname, typeof feldwert
 * value: _count
 * no es6 in ddocs!
 */

import app from 'ampersand-app'

const ddoc = {
  _id: '_design/fieldsOfGroup',
  views: {
    fieldsOfGroup: {
      map: function (doc) {
        if (doc.Gruppe && doc.Typ && doc.Typ === 'Objekt') {
          if (doc.Taxonomien) {
            doc.Taxonomien.forEach(function(taxonomy) {
              if (taxonomy.Eigenschaften) {
                var eigenschaften = taxonomy.Eigenschaften
                Object.keys(eigenschaften).forEach(function(feldname) {
                  var feldwert = eigenschaften[feldname]
                  emit(
                    [doc.Gruppe, 'taxonomy', taxonomy.Name, feldname, typeof feldwert],
                    doc._id
                  )
                })
              }
            })
          }

          if (doc.Eigenschaftensammlungen) {
            doc.Eigenschaftensammlungen.forEach(function(pc) {
              if (pc.Eigenschaften) {
                var eigenschaften = pc.Eigenschaften
                Object.keys(eigenschaften).forEach(function(feldname) {
                  var feldwert = eigenschaften[feldname]
                  emit(
                    [doc.Gruppe, 'propertyCollection', pc.Name, feldname, typeof feldwert],
                    doc._id
                  )
                })
              }
            })
          }

          if (doc.Beziehungssammlungen) {
            doc.Beziehungssammlungen.forEach(function(beziehungssammlung) {
              if (
                beziehungssammlung.Beziehungen &&
                beziehungssammlung.Beziehungen.length > 0
              ) {
                beziehungssammlung.Beziehungen.forEach(function(beziehung) {
                  Object.keys(beziehung).forEach(function(feldname) {
                    var feldwert = beziehung[feldname]
                    // irgendwie liefert dieser Loop auch Zahlen,
                    // die aussehen als wären sie die keys eines Arrays. Ausschliessen
                    if (isNaN(parseInt(feldname, 10))) {
                      // jetzt loopen wir durch die Daten der Beziehung
                      emit(
                        [doc.Gruppe, 'relation', beziehungssammlung.Name, feldname, typeof feldwert],
                        doc._id
                      )
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

export default (group, offlineIndexes) =>
  new Promise((resolve, reject) => {
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
      local() {
        return new Promise((res, rej) => {
          app.localDb.put(ddoc)
            .catch((error) => {
              // ignore if doc already exists
              if (error.status !== 409) reject(error)
            })
            .then(() => app.localDb.query('fieldsOfGroup', queryOptions))
            .then((result) => res(result))
            .catch((error) => rej(error))
        })
      },
      remote() {
        return new Promise((res, rej) => {
          app.remoteDb.query('fieldsOfGroup', queryOptionsCouch)
            .then((result) => res(result))
            .catch((error) => rej(error))
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
        fields = fields.sort((field) =>
          [field.cName, field.fName]
        )
        resolve(fields)
      })
      .catch((error) => reject(error))
  })
