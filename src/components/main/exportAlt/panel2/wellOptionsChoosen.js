'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'
import _ from 'lodash'

const ulStyle = {
  paddingLeft: 20,
  marginBottom: 3
}

export default React.createClass({
  displayName: 'OptionsChoosen',

  propTypes: {
    urlOptions: React.PropTypes.object,
    includeDataFromSynonyms: React.PropTypes.bool,
    oneRowPerRelation: React.PropTypes.bool
  },

  groupsText () {
    const { urlOptions } = this.props
    const groups = urlOptions.object.Gruppen.value
    const prefix = groups.length > 1 ? 'Gruppen: ' : 'Gruppe: '
    return prefix + groups.join(', ')
  },

  dataFromSynonymsText () {
    const { includeDataFromSynonyms } = this.props
    return includeDataFromSynonyms ? 'Informationen von Synonymen werden berücksichtigt' : 'Informationen von Synonymen werden ignoriert'
  },

  oneRowPerRelationText () {
    const { oneRowPerRelation } = this.props
    return oneRowPerRelation ? 'Pro Beziehung eine Zeile' : 'Pro Art/Lebensraum eine Zeile, alle Beziehungen kommagetrennt in einem Feld'
  },

  fields () {
    const { urlOptions } = this.props
    let fields = []
    Object.keys(urlOptions).forEach((cName) => {
      Object.keys(urlOptions[cName]).forEach((fName) => {
        const field = urlOptions[cName][fName]
        if (field.export) fields.push({ cName, fName })
      })
    })
    return fields
  },

  fieldsList () {
    const fields = this.fields()
    if (fields.length > 0) {
      return fields.map((field, index) => {
        const fName = field.fName
        const cName = field.cName
        if (cName === 'object') return <li key={index}>{fName === '_id' ? 'GUID' : fName}</li>
        return <li key={index}>{cName}: {fName}</li>
      })
    }
    return <li>Keine Eigenschaft gewählt</li>
  },

  render () {
    const pStyle = {
      marginBottom: 0,
      fontWeight: 'bold'
    }
    return (
      <Well bsSize='small'>
        <p style={pStyle}>Gewählte Optionen:</p>
        <ul style={ulStyle}>
          <li>{this.groupsText()}</li>
          <li>{this.dataFromSynonymsText()}</li>
          <li>{this.oneRowPerRelationText()}</li>
          <li>Eigenschaften:
            <ul style={ulStyle}>
              {this.fieldsList()}
            </ul>
          </li>
        </ul>
      </Well>
    )
  }
})
