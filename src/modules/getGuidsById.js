/*
 * built for the import
 * idField is values of Field "Zugehörige ID in ArtenDb"
 * it is one of: GUID, Fauna, Flora, Moose, Macromycetes
 */

import queryGuid from '../queries/guidById.js'
import queryFauna from '../queries/faunaById.js'
import queryFlora from '../queries/floraById.js'
import queryMoose from '../queries/mooseById.js'
import queryMacromycetes from '../queries/macromycetesById.js'

// build object of functions, to call dynamically
const dynamicFuntions = {
  GUID: queryGuid,
  Fauna: queryFauna,
  Flora: queryFlora,
  Moose: queryMoose,
  Macromycetes: queryMacromycetes
}

export default (idField, ids) => new Promise((resolve, reject) => {
  // call the apropriate function and pass the ids
  dynamicFuntions[idField](ids)
    .then((returnObjects) => resolve(returnObjects))
    .catch((error) => reject('error fetching GUIDs', error))
})
