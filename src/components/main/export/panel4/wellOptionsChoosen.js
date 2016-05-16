'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'
import { reject } from 'lodash'

const ulStyle = {
  paddingLeft: 20,
  marginBottom: 3
}

export default React.createClass({
  displayName: 'OptionsChoosen',

  propTypes: {
    exportOptions: React.PropTypes.object,
    onlyObjectsWithCollectionData: React.PropTypes.bool,
    includeDataFromSynonyms: React.PropTypes.bool,
    oneRowPerRelation: React.PropTypes.bool,
    combineTaxonomies: React.PropTypes.bool
  },

  groupsText() {
    const { exportOptions } = this.props
    const groups = exportOptions.object.Gruppen.value
    const prefix = groups.length > 1 ? 'Gruppen: ' : 'Gruppe: '
    return prefix + groups.join(', ')
  },

  taxonomienZusammenfassenText() {
    const { combineTaxonomies } = this.props
    return (
      combineTaxonomies ?
      'Die Felder der Taxonomien werden zusammengefasst' :
      'Die Felder der Taxonomien werden einzeln dargestellt'
    )
  },

  dataFromSynonymsText() {
    const { includeDataFromSynonyms } = this.props
    return (
      includeDataFromSynonyms ?
      'Informationen von Synonymen werden berücksichtigt' :
      'Informationen von Synonymen werden ignoriert'
    )
  },

  onlyObjectsWithCollectionDataText() {
    const { onlyObjectsWithCollectionData } = this.props
    return (
      onlyObjectsWithCollectionData ?
      'Filterkriterien in Eigenschaften- und Beziehungssammlungen filtern Arten bzw. Lebensräume' :
      'Filterkriterien in Eigenschaften- und Beziehungssammlungen filtern Eigenschaften- bzw. Beziehungssammlungen'
    )
  },

  oneRowPerRelationText() {
    const { oneRowPerRelation } = this.props
    return (
      oneRowPerRelation ?
      'Pro Beziehung eine Zeile' :
      'Pro Art/Lebensraum eine Zeile, alle Beziehungen kommagetrennt in einem Feld'
    )
  },

  filtersAndFields() {
    const { exportOptions } = this.props
    const filters = []
    const fields = []
    Object.keys(exportOptions).forEach((cName) => {
      Object.keys(exportOptions[cName]).forEach((fName) => {
        const field = exportOptions[cName][fName]
        if (field.value) {
          const filterValue = field.co !== undefined ? `${field.co} ${field.value}` : `${field.value}`
          filters.push({ cName, fName, filterValue })
        }
        if (field.export) fields.push({ cName, fName })
      })
    })
    return ({ filters, fields })
  },

  filtersList() {
    const spanStyle = {
      backgroundColor: '#DADADA',
      padding: '1px 8px',
      marginLeft: 5,
      borderRadius: 3
    }
    let { filters } = this.filtersAndFields()
    // don't want to show Gruppen, it is already shown as groupsText
    filters = reject(filters, (filter) => filter.cName === 'object' && filter.fName === 'Gruppen')
    if (filters.length > 0) {
      return filters.map((filter, index) => {
        const fName = filter.fName
        const cName = filter.cName
        const filterValue = filter.filterValue
        if (cName === 'object') {
          return (
            <li key={index}>
              {fName === '_id' ? 'GUID' : fName}&nbsp;
              <span style={spanStyle}>
                {filterValue}
              </span>
            </li>
          )
        }
        return (
          <li key={index}>
            {cName}: {fName}&nbsp;
            <span style={spanStyle}>
              {filterValue}
            </span>
          </li>
        )
      })
    }
    return <li>Kein Filter gewählt</li>
  },

  fieldsList() {
    const { fields } = this.filtersAndFields()
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

  render() {
    const pStyle = {
      marginBottom: 0,
      fontWeight: 'bold'
    }
    return (
      <Well bsSize="small">
        <p style={pStyle}>Gewählte Optionen:</p>
        <ul style={ulStyle}>
          <li>{this.groupsText()}</li>
          <li>{this.taxonomienZusammenfassenText()}</li>
          <li>{this.dataFromSynonymsText()}</li>
          <li>{this.onlyObjectsWithCollectionDataText()}</li>
          <li>{this.oneRowPerRelationText()}</li>
          <li>Filter:
            <ul style={ulStyle}>
              {this.filtersList()}
            </ul>
          </li>
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
