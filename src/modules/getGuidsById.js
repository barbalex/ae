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

export default (idField, ids, offlineIndexes) => {
  // build object of functions, to call dynamically
  const dynamicFuntions = {
    GUID: queryGuid,
    Fauna: queryFauna,
    Flora: queryFlora,
    Moose: queryMoose,
    Macromycetes: queryMacromycetes
  }
  return new Promise((resolve, reject) => {
    // call the apropriate function and pass the ids
    dynamicFuntions[idField](ids, offlineIndexes)
      .then((returnObjects) => resolve(returnObjects))
      .catch((error) => reject('error fetching GUIDs', error))
  })
}
