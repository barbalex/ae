'use strict'

import app from 'ampersand-app'
import _ from 'lodash'
import queryFauna from '../queries/faunaById.js'
import queryFlora from '../queries/floraById.js'
import queryMoose from '../queries/mooseById.js'
import queryMacromycetes from '../queries/macromycetesById.js'

export default function (idField, ids) {
  // build object of functions, to call dynamically
  let dynamicFuntions = {
    Fauna: queryFauna,
    Flora: queryFlora,
    Moose: queryMoose,
    Macromycetes: queryMacromycetes
  }
  return new Promise(function (resolve, reject) {
    // call the apropriate view and pass the ids
    // by taxonomie id: viewname = Gruppe.toLowerCase() + ById
    // guid: allDocs
    if (idField === 'GUID') {
      const options = {
        keys: ids,
        include_docs: true
      }
      app.localDb.allDocs(options)
        .then(function (result) {
          const docs = _.pluck(result.rows, 'doc')
          resolve(docs)
        })
        .catch(function (error) {
          reject('error fetching docs', error)
        })
    } else {
      dynamicFuntions[idField](ids)
        .then(function (docs) {
          resolve(docs)
        })
        .catch(function (error) {
          reject('error fetching docs', error)
        })
    }
  })
}
