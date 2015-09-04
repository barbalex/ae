/*
 * get: idsAeIdField, idsImportIdField, pcsToImport
 * return alert
 */
'use strict'

import React from 'react'
import _ from 'lodash'
import { Alert } from 'react-bootstrap'
import getSuccessTypeFromAnalysis from './getSuccessTypeFromAnalysis.js'

export default React.createClass({
  displayName: 'AlertIdsAnalysisResult',

  propTypes: {
    idsAeIdField: React.PropTypes.string,
    idsImportIdField: React.PropTypes.string,
    pcsToImport: React.PropTypes.array,
    idsAnalysisComplete: React.PropTypes.bool,
    idsNumberOfRecordsWithIdValue: React.PropTypes.number,
    idsDuplicate: React.PropTypes.array,
    idsNumberImportable: React.PropTypes.number,
    idsNotImportable: React.PropTypes.array,
    idsNotANumber: React.PropTypes.array

  },

  render () {
    const { pcsToImport, idsImportIdField, idsAnalysisComplete, idsNumberOfRecordsWithIdValue, idsNumberImportable, idsDuplicate, idsNotANumber } = this.props
    let { idsNotImportable } = this.props

    if (!idsAnalysisComplete) {
      return <Alert bsStyle='info'>Bitte warten, die Daten werden analysiert.<br/>Das kann eine Weile dauern...</Alert>
    }

    const titleText = <p>Die Importtabelle enthält {pcsToImport.length} Datensätze:</p>
    const recordsWithIdValueText = `${idsNumberOfRecordsWithIdValue} enthalten einen Wert im Feld "${idsImportIdField}"`
    const idsDuplicateText = `${idsDuplicate.length} enthalten die folgenden mehrfach vorkommenden IDs: ` + _.unique(idsDuplicate).join(', ')
    const recordsImportableText = `${idsNumberImportable} können zugeordnet und importiert werden`

    const idsNotNumbersText = `${idsNotANumber.length} mit den folgenden Werten im Feld "${idsImportIdField}" enthalten keine Zahlen:`
    const idsNotNumbersList = idsNotANumber.join(' | ')

    const recordsNotImportableText = `${idsNotImportable.length} mit den folgenden Werten im Feld "${idsImportIdField}" können nicht zugeordnet und importiert werden:`
    const idsNotImportableList = idsNotImportable.join(' | ')

    const variablesToPass = {
      pcsToImport: pcsToImport,
      idsNumberImportable: idsNumberImportable,
      idsNotImportable: idsNotImportable,
      idsNotANumber: idsNotANumber,
      idsDuplicate: idsDuplicate
    }
    const successType = getSuccessTypeFromAnalysis(variablesToPass)

    return (
      <Alert bsStyle={successType}>
        <p><strong>Ergebnis der Analyse</strong></p>
        {titleText}
        <ul>
          <li>{recordsWithIdValueText}</li>
          {idsNotANumber.length === 0 ? null : <li>{idsNotNumbersText}<br/>{idsNotNumbersList}</li>}
          {idsDuplicate.length === 0 ? null : <li>{idsDuplicateText}</li>}
          {idsNotImportable.length === 0 ? null : <li>{recordsNotImportableText}<br/>{idsNotImportableList}</li>}
          <li>{recordsImportableText}</li>
        </ul>
      </Alert>
    )
  }
})
