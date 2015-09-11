/*
 * get: idsAeIdField, idsImportIdField, pcsToImport
 * return alert
 */
'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'
import getSuccessTypeFromAnalysis from './getSuccessTypeFromAnalysis.js'

export default React.createClass({
  displayName: 'AlertIdsAnalysisResult',

  propTypes: {
    idsAeIdField: React.PropTypes.string,
    idsImportIdField: React.PropTypes.string,
    rcsToImport: React.PropTypes.array,
    idsAnalysisComplete: React.PropTypes.bool,
    idsNumberOfRecordsWithIdValue: React.PropTypes.number,
    idsNumberImportable: React.PropTypes.number,
    idsNotImportable: React.PropTypes.array,
    idsNotANumber: React.PropTypes.array

  },

  render () {
    const { rcsToImport, idsImportIdField, idsAeIdField, idsAnalysisComplete, idsNumberOfRecordsWithIdValue, idsNumberImportable, idsNotANumber } = this.props
    let { idsNotImportable } = this.props

    if (!idsAnalysisComplete) {
      if (idsAeIdField === 'GUID') return <Alert bsStyle='info'>Bitte warten, die Daten werden analysiert...</Alert>
      return (
        <Alert bsStyle='info'>Bitte warten, die Daten werden analysiert.<br/>
          Das kann eine Weile dauern...<br/>
          ...vor allem wenn Sie zum ersten Mal Daten mit Hilfe einer ID eines nationalen Zentrums importieren:<br/>
          ...dann muss nämlich der entsprechende Index aufgebaut werden.</Alert>
      )
    }

    const titleText = <p>Die Importtabelle enthält {rcsToImport.length} Datensätze:</p>
    const recordsWithIdValueText = `${idsNumberOfRecordsWithIdValue} enthalten einen Wert im Feld "${idsImportIdField}"`
    const recordsImportableText = `${idsNumberImportable} können zugeordnet und importiert werden`

    const idsNotNumbersText = `${idsNotANumber.length} mit den folgenden Werten im Feld "${idsImportIdField}" enthalten keine Zahlen:`
    const idsNotNumbersList = idsNotANumber.join(' | ')

    const recordsNotImportableText = `${idsNotImportable.length} mit den folgenden Werten im Feld "${idsImportIdField}" können nicht zugeordnet und importiert werden:`
    const idsNotImportableList = idsNotImportable.join(' | ')
    const successType = getSuccessTypeFromAnalysis({ rcsToImport, idsNumberImportable, idsNotImportable, idsNotANumber })

    return (
      <Alert bsStyle={successType}>
        <p><strong>Ergebnis der Analyse</strong></p>
        {titleText}
        <ul>
          <li>{recordsWithIdValueText}</li>
          {idsNotANumber.length === 0 ? null : <li>{idsNotNumbersText}<br/>{idsNotNumbersList}</li>}
          {idsNotImportable.length === 0 ? null : <li>{recordsNotImportableText}<br/>{idsNotImportableList}</li>}
          <li>{recordsImportableText}</li>
        </ul>
      </Alert>
    )
  }
})
