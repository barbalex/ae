/*
 * get: aeIdField, importIdField, pcsToImport
 * return alert
 */
'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'AlertIdsAnalysisResult',

  propTypes: {
    aeIdField: React.PropTypes.string,
    importIdField: React.PropTypes.string,
    pcsToImport: React.PropTypes.array,
    analysisComplete: React.PropTypes.bool,
    recordsWithIdValueCount: React.PropTypes.number,
    recordsImportableCount: React.PropTypes.number,
    recordsNotImportable: React.PropTypes.array,
    onChangeIdsAnalysisResult: React.PropTypes.func

  },

  getInitialState () {
    return {
      analysisComplete: false,
      recordsWithIdValueCount: 0,
      recordsImportableCount: 0,
      recordsNotImportable: []
    }
  },

  componentDidMount () {
    // TODO: start analysis
    // when finished, call onChangeIdsAnalysisResult and pass it sucess type
  },

  getSuccessType () {
    const { pcsToImport, recordsImportableCount, recordsNotImportable } = this.state
    if (recordsNotImportable > 0) return 'error'
    if (recordsImportableCount < pcsToImport.length) return 'warning'
    return 'success'
  },

  render () {
    const { analysisComplete, pcsToImport, recordsWithIdValueCount, importIdField, recordsImportableCount, recordsNotImportable } = this.state

    if (!analysisComplete) {
      return <Alert bsStyle='info' className='feld'>Bitte warten, die Daten werden analysiert.<br/>Das kann eine Weile dauern...</Alert>
    }

    const titleText = `Die Importtabelle enthält ${pcsToImport.length} Datensätze:`
    const recordsWithIdValueText = `${recordsWithIdValueCount} enthalten einen Wert im Feld "${importIdField}"`
    const recordsImportableText = `${recordsImportableCount} können zugeordnet und importiert werden`
    const recordsNotImportableText = `ACHTUNG: ${recordsNotImportable.length} Datensätze mit den folgenden Werten im Feld "${importIdField}" können NICHT zugeordnet und importiert werden:<br/>` + recordsNotImportable.join(', ')
    const successType = this.getSuccessType()

    if (successType === 'success') {
      return (
        <Alert bsStyle={successType} className='feld'>{titleText} + '<ul><li>' + recordsWithIdValueText + '</li><li>' + recordsImportableText + '</li><li>' + recordsNotImportableText + '</li></ul>'</Alert>
      )
    }
    return (
      <Alert bsStyle={successType} className='feld'>{titleText} + '<ul><li>' + recordsWithIdValueText + '</li><li>' + recordsImportableText + '</li></ul>'</Alert>
    )
  }
})
