/**
 * gets urlOptions and objects
 * builds and returns export fields array used to pass from alt to arteigenschaften.ch
 */

'use strict'

import _ from 'lodash'

export default (urlOptions) => {
  console.log('buildExportObjects.js, urlOptions', urlOptions)
  let felder = []

  // 1. add _id if applicable
  if (_.get(urlOptions, 'object._id.export')) {
    let feld = {}
    feld.DsName = 'Objekt'
    feld.Feldname = 'GUID'
    felder.push(feld)
  }

  // 2. add Gruppen if applicable
  if (_.get(urlOptions, 'object.Gruppe.export')) {
    let feld = {}
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
        if (_.get(urlOptions, `${cName}.${fName}.export`) && fName !== '_id' && fName !== 'Gruppe') {
          const dsTypeNames = {
            taxonomy: 'Taxonomie',
            pc: 'Datensammlung',
            rc: 'Beziehung'
          }
          const dsType = dsTypeNames[cType]
          let feld = {}
          feld.DsTyp = dsType
          feld.DsName = cName
          feld.Feldname = fName
          felder.push(feld)
        }
      })
    }
  })

  console.log('buildExportObjects.js, felder', felder)
  return felder
}
