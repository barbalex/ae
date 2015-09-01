/*
 * built for the import
 * idField is values of Field "Zugehörige ID in ArtenDb"
 * it is one of: GUID, Fauna, Flora, Moose, Macromycetes
 */

'use strict'

import queryGuid from '../queries/guidById.js'
import queryFauna from '../queries/faunaById.js'
import queryFlora from '../queries/floraById.js'
import queryMoose from '../queries/mooseById.js'
import queryMacromycetes from '../queries/macromycetesById.js'

export default function (idField, ids) {
  // build object of functions, to call dynamically
  const dynamicFuntions = {
    GUID: queryGuid,
    Fauna: queryFauna,
    Flora: queryFlora,
    Moose: queryMoose,
    Macromycetes: queryMacromycetes
  }
  return new Promise(function (resolve, reject) {
    // call the apropriate function and pass the ids
    dynamicFuntions[idField](ids)
      .then(function (docs) {
        resolve(docs)
      })
      .catch(function (error) {
        reject('error fetching docs', error)
      })
  })
}
