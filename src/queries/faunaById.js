/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options, passing an array of ids (Taxonomie ID)
 * emits the Taxonomie ID as key and guid as value
 */

import app from 'ampersand-app'

const ddoc = {
  id: '_design/faunaById',
  views: {
    faunaById: {
      map: function (doc) {
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
          doc.Typ && doc.Typ === 'Objekt' &&
          doc.Gruppe && doc.Gruppe === 'Fauna' &&
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

export default (ids) => {
  const queryOptions = {
    keys: ids
  }

  return new Promise((resolve, reject) => {
    app.remoteDb.query('faunaById', queryOptions)
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
