/**
 * gets urlOptions and objects
 * builds and returns export fields array used to pass from alt to arteigenschaften.ch
 */

import { get } from 'lodash'

export default (urlOptions) => {
  const felder = []

  // 1. add id if applicable
  if (get(urlOptions, 'object.id.export')) {
    const feld = {}
    feld.DsName = 'Objekt'
    feld.Feldname = 'GUID'
    felder.push(feld)
  }

  // 2. add Gruppen if applicable
  if (get(urlOptions, 'object.Gruppe.export')) {
    const feld = {}
    feld.DsName = 'Objekt'
    feld.Feldname = 'Gruppe'
    felder.push(feld)
  }

  // 3. push any other pc or rc field
  Object.keys(urlOptions).forEach((cName) => {
    const cType = urlOptions[cName].cType
    if (cType) {
      // o.k., this is not object. Must be taxonomy, pc or rc
      Object.keys(urlOptions[cName]).forEach((fName) => {
        if (
          get(urlOptions, `${cName}.${fName}.export`) &&
          fName !== 'id' && fName !== 'Gruppe'
        ) {
          const dsTypeNames = {
            taxonomy: 'Taxonomie',
            pc: 'Datensammlung',
            rc: 'Beziehung'
          }
          const dsType = dsTypeNames[cType]
          const feld = {}
          feld.DsTyp = dsType
          feld.DsName = cName
          feld.Feldname = fName
          felder.push(feld)
        }
      })
    }
  })

  return felder
}
