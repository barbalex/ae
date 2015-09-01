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
    const { pcsToImport, idsImportIdField, idsAeIdField, idsAnalysisComplete, idsNumberOfRecordsWithIdValue, idsNumberImportable, idsDuplicate, idsNotANumber } = this.props
    let { idsNotImportable } = this.props

    if (!(idsImportIdField && idsAeIdField)) return null

    if (!idsAnalysisComplete) {
      return <Alert bsStyle='info' className='feld'>Bitte warten, die Daten werden analysiert.<br/>Das kann eine Weile dauern...</Alert>
    }

    const titleText = `Die Importtabelle enthält ${pcsToImport.length} Datensätze:`
    const recordsWithIdValueText = `${idsNumberOfRecordsWithIdValue} enthalten einen Wert im Feld "${idsImportIdField}"`
    const idsDuplicateText = idsDuplicate.length > 0 ? `${idsDuplicate.length} enthalten die folgenden mehrfach vorkommenden IDs: ` + _.unique(idsDuplicate).join(', ') : 'Keine ID kommt mehrfach vor :-)'
    const recordsImportableText = `${idsNumberImportable} können zugeordnet und importiert werden`

    const idsNotNumbersText = `Achtung: ${idsNotANumber.length} Datensätze mit den folgenden Werten im Feld "${idsImportIdField}" enthalten keine Zahlen:`
    const idsNotNumbersList = idsNotANumber.length === 0 ? null : idsNotANumber.join(' | ')

    const recordsNotImportableText = `Achtung: ${idsNotImportable.length} Datensätze mit den folgenden Werten im Feld "${idsImportIdField}" können nicht zugeordnet und importiert werden:`
    const idsNotImportableList = idsNotImportable.length === 0 ? null : idsNotImportable.join(' | ')
    const variablesToPass = {
      pcsToImport: pcsToImport,
      idsNumberImportable: idsNumberImportable,
      idsNotImportable: idsNotImportable,
      idsNotANumber: idsNotANumber,
      idsDuplicate: idsDuplicate
    }
    const successType = getSuccessTypeFromAnalysis(variablesToPass)

    return (
      <Alert bsStyle={successType} className='feld'>
        {titleText}
        <ul>
          <li>{recordsWithIdValueText}</li>
          {idsNotANumber.length === 0 ? null : <li>{idsNotNumbersText}<br/>{idsNotNumbersList}</li>}
          {idsDuplicate.length === 0 ? null : <li>{idsDuplicateText}</li>}
          <li>{recordsImportableText}</li>
          {idsNotImportable.length === 0 ? null : <li>{recordsNotImportableText}<br/>{idsNotImportableList}</li>}
        </ul>
      </Alert>
    )
  }
})
