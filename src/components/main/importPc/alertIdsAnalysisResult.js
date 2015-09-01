/*
 * get: aeIdField, importIdField, pcsToImport
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
    aeIdField: React.PropTypes.string,
    importIdField: React.PropTypes.string,
    pcsToImport: React.PropTypes.array,
    analysisComplete: React.PropTypes.bool,
    recordsWithIdValueCount: React.PropTypes.number,
    idsDuplicate: React.PropTypes.array,
    idsImportableCount: React.PropTypes.number,
    idsNotImportable: React.PropTypes.array,
    idsNotNumber: React.PropTypes.array

  },

  render () {
    const { pcsToImport, importIdField, aeIdField, analysisComplete, recordsWithIdValueCount, idsImportableCount, idsDuplicate, idsNotNumber } = this.props
    let { idsNotImportable } = this.props

    if (!(importIdField && aeIdField)) return null

    if (!analysisComplete) {
      return <Alert bsStyle='info' className='feld'>Bitte warten, die Daten werden analysiert.<br/>Das kann eine Weile dauern...</Alert>
    }

    const titleText = `Die Importtabelle enthält ${pcsToImport.length} Datensätze:`
    const recordsWithIdValueText = `${recordsWithIdValueCount} enthalten einen Wert im Feld "${importIdField}"`
    const idsDuplicateText = idsDuplicate.length > 0 ? `${idsDuplicate.length} enthalten die folgenden mehrfach vorkommenden IDs: ` + _.unique(idsDuplicate).join(', ') : 'Keine ID kommt mehrfach vor :-)'
    const recordsImportableText = `${idsImportableCount} können zugeordnet und importiert werden`

    const idsNotNumbersText = `ACHTUNG: ${idsNotNumber.length} Datensätze mit den folgenden Werten im Feld "${importIdField}" enthalten keine Zahlen:`
    const idsNotNumbersList = idsNotNumber.length === 0 ? null : idsNotNumber.join(' | ')

    const recordsNotImportableText = `ACHTUNG: ${idsNotImportable.length} Datensätze mit den folgenden Werten im Feld "${importIdField}" können NICHT zugeordnet und importiert werden:`
    const idsNotImportableList = idsNotImportable.length === 0 ? null : idsNotImportable.join(' | ')
    const variablesToPass = {
      pcsToImport: pcsToImport,
      idsImportableCount: idsImportableCount,
      idsNotImportable: idsNotImportable,
      idsNotNumber: idsNotNumber,
      idsDuplicate: idsDuplicate
    }
    const successType = getSuccessTypeFromAnalysis(variablesToPass)

    if (successType === 'success') {
      return (
        <Alert bsStyle={successType} className='feld'>{titleText}<ul><li>{recordsWithIdValueText}</li><li>{recordsImportableText}</li></ul></Alert>
      )
    }
    return (
      <Alert bsStyle={successType} className='feld'>
        {titleText}
        <ul>
          <li>{recordsWithIdValueText}</li>
          {idsNotNumber.length === 0 ? null : <li>{idsNotNumbersText}<br/>{idsNotNumbersList}</li>}
          <li>{idsDuplicateText}</li>
          <li>{recordsImportableText}</li>
          {idsNotImportable.length === 0 ? null : <li>{recordsNotImportableText}<br/>{idsNotImportableList}</li>}
        </ul>
      </Alert>
    )
  }
})
