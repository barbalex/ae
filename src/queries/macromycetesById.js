/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options, passing an array of ids (Taxonomie ID)
 * emits the Taxonomie ID as key and guid as value
 *
 * if offlineIndexes is true: queries from remote and does not create design doc
 *
 * no es6 in ddocs!
 */

import app from 'ampersand-app'

const ddoc = {
  _id: '_design/macromycetesById',
  views: {
    macromycetesById: {
      map: function(doc) {
        function findStandardTaxonomyInDoc(doc) {
          var standardtaxonomie = null
          doc.Taxonomien.forEach(function(taxonomy) {
            if (taxonomy.Standardtaxonomie) {
              standardtaxonomie = taxonomy
            }
          })
          return standardtaxonomie
        }
        if (
          doc.Typ &&
          doc.Typ === 'Objekt' &&
          doc.Gruppe &&
          doc.Gruppe === 'Macromycetes' &&
          doc.Taxonomien
        ) {
          var standardtaxonomie = findStandardTaxonomyInDoc(doc)
          if (standardtaxonomie) {
            emit(standardtaxonomie.Eigenschaften['Taxonomie ID'], null)
          }
        }
      }.toString()
    }
  }
}

export default (ids, offlineIndexes) => {
  const queryOptions = {
    keys: ids
  }
  const query = {
    local() {
      return new Promise((resolve, reject) => {
        app.localDb.put(ddoc)
          .catch((error) => {
            // ignore if doc already exists
            if (error.status !== 409) reject(error)
          })
          .then(() => app.localDb.query('macromycetesById', queryOptions))
          .then((result) => resolve(result))
          .catch((error) => reject(error))
      })
    },
    remote() {
      return new Promise((resolve, reject) => {
        app.remoteDb.query('macromycetesById', queryOptions)
          .then((result) => resolve(result))
          .catch((error) => reject(error))
      })
    }
  }
  const db = offlineIndexes ? 'local' : 'remote'

  return new Promise((resolve, reject) => {
    query[db]()
      .then((result) => {
        const returnObject = {}
        result.rows.forEach((row) => {
          returnObject[row.key] = row.id
        })
        resolve(returnObject)
      })
      .catch((error) => reject(error))
  })
}
