'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

const ulStyle = {
  paddingLeft: 20,
  marginBottom: 3
}

const pStyle = {
  marginBottom: 0,
  fontWeight: 'bold'
}

const oneRowPerRelationText = (oneRowPerRelation) => (
  oneRowPerRelation ?
  'Pro Beziehung eine Zeile' :
  'Pro Art/Lebensraum eine Zeile, alle Beziehungen kommagetrennt in einem Feld'
)

const dataFromSynonymsText = (includeDataFromSynonyms) => (
  includeDataFromSynonyms ?
  'Informationen von Synonymen werden berücksichtigt' :
  'Informationen von Synonymen werden ignoriert'
)

const groupsText = (urlOptions) => {
  const groups = urlOptions.object.Gruppen.value
  const prefix = groups.length > 1 ? 'Gruppen: ' : 'Gruppe: '
  return prefix + groups.join(', ')
}

const fields = (urlOptions) => {
  const myFields = []
  Object.keys(urlOptions).forEach((cName) => {
    Object.keys(urlOptions[cName]).forEach((fName) => {
      const field = urlOptions[cName][fName]
      if (field.export) myFields.push({ cName, fName })
    })
  })
  return myFields
}

const fieldsList = (urlOptions) => {
  const myFields = fields(urlOptions)
  if (myFields.length > 0) {
    return myFields.map((field, index) => {
      const fName = field.fName
      const cName = field.cName
      if (cName === 'object') return <li key={index}>{fName === '_id' ? 'GUID' : fName}</li>
      return <li key={index}>{cName}: {fName}</li>
    })
  }
  return <li>Keine Eigenschaft gewählt</li>
}

const WellOptionsChoosen = ({ includeDataFromSynonyms, oneRowPerRelation, urlOptions }) =>
  <Well bsSize="small">
    <p style={pStyle}>Gewählte Optionen:</p>
    <ul style={ulStyle}>
      <li>{groupsText(urlOptions)}</li>
      <li>{dataFromSynonymsText(includeDataFromSynonyms)}</li>
      <li>{oneRowPerRelationText(oneRowPerRelation)}</li>
      <li>Eigenschaften:
        <ul style={ulStyle}>
          {fieldsList(urlOptions)}
        </ul>
      </li>
    </ul>
  </Well>

WellOptionsChoosen.displayName = 'WellOptionsChoosen'

WellOptionsChoosen.propTypes = {
  urlOptions: React.PropTypes.object,
  includeDataFromSynonyms: React.PropTypes.bool,
  oneRowPerRelation: React.PropTypes.bool
}

export default WellOptionsChoosen
