/*
 * get: aeIdField, importIdField, pcsToImport
 * return alert
 */
'use strict'

import React from 'react'
import _ from 'lodash'
import { Alert } from 'react-bootstrap'
import getItemsById from '../../../modules/getItemsById.js'

export default React.createClass({
  displayName: 'AlertIdsAnalysisResult',

  propTypes: {
    aeIdField: React.PropTypes.string,
    importIdField: React.PropTypes.string,
    pcsToImport: React.PropTypes.array,
    objectsToImportPcsInTo: React.PropTypes.array,
    analysisComplete: React.PropTypes.bool,
    recordsWithIdValueCount: React.PropTypes.number,
    idsDuplicate: React.PropTypes.array,
    idsImportableCount: React.PropTypes.number,
    idsNotImportable: React.PropTypes.array,
    onChangeIdsAnalysisResult: React.PropTypes.func

  },

  getInitialState () {
    return {
      analysisComplete: false,
      recordsWithIdValueCount: 0,
      idsDuplicate: [],
      idsImportableCount: 0,
      idsNotImportable: [],
      objectsToImportPcsInTo: []
    }
  },

  componentDidMount () {
    const { aeIdField, pcsToImport, importIdField, onChangeIdsAnalysisResult } = this.props
    const that = this

    // only go on if both values exist
    if (aeIdField && importIdField) {
      const ids = _.pluck(pcsToImport, importIdField)
      // start analysis
      getItemsById(aeIdField, ids)
        .then(function (objectsToImportPcsInTo) {
          const idsToImportWithDuplicates = _.pluck(pcsToImport, importIdField)
          const idsToImport = _.unique(idsToImportWithDuplicates)
          const recordsWithIdValueCount = idsToImportWithDuplicates.length
          const idsDuplicate = _.difference(idsToImportWithDuplicates, idsToImport)
          const idAttribute = aeIdField === 'GUID' ? '_id' : 'Taxonomien[0].Eigenschaften["Taxonomie ID"]'
          const idsFetched = _.pluck(objectsToImportPcsInTo, idAttribute)
          const idsImportable = _.intersection(idsToImport, idsFetched)
          const idsImportableCount = idsImportable.length
          const idsNotImportable = _.difference(idsToImport, idsFetched)

          // finished? render...
          that.setState({
            recordsWithIdValueCount: recordsWithIdValueCount,
            idsDuplicate: idsDuplicate,
            idsImportableCount: idsImportableCount,
            idsNotImportable: idsNotImportable,
            analysisComplete: true
          })
          // ...then call onChangeIdsAnalysisResult and pass it sucess type and objectsToImportPcsInTo
          const idsAnalysisResultType = that.getSuccessType()
          onChangeIdsAnalysisResult(idsAnalysisResultType, objectsToImportPcsInTo)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },

  getSuccessType () {
    const { idsImportableCount, idsNotImportable, idsDuplicate } = this.state
    const { pcsToImport } = this.props
    if (idsNotImportable > 0) return 'error'
    if ((idsImportableCount < pcsToImport.length) || idsDuplicate.length > 0) return 'warning'
    return 'success'
  },

  render () {
    const { analysisComplete, recordsWithIdValueCount, idsImportableCount, idsNotImportable, idsDuplicate } = this.state
    const { pcsToImport, importIdField, aeIdField } = this.props

    if (!(importIdField && aeIdField)) return null

    if (!analysisComplete) {
      return <Alert bsStyle='info' className='feld'>Bitte warten, die Daten werden analysiert.<br/>Das kann eine Weile dauern...</Alert>
    }

    const titleText = `Die Importtabelle enthält ${pcsToImport.length} Datensätze:`
    const recordsWithIdValueText = `${recordsWithIdValueCount} enthalten einen Wert im Feld "${importIdField}"`
    const idsDuplicateText = idsDuplicate.length > 0 ? `${idsDuplicate.length} enthalten die folgenden mehrfach vorkommenden IDs: ` + _.unique(idsDuplicate).join(', ') : 'Keine ID kommt mehrfach vor :-)'
    const recordsImportableText = `${idsImportableCount} können zugeordnet und importiert werden`
    const recordsNotImportableText = `ACHTUNG: ${idsNotImportable.length} Datensätze mit den folgenden Werten im Feld "${importIdField}" können NICHT zugeordnet und importiert werden:<br/>` + idsNotImportable.join(', ')
    const successType = this.getSuccessType()

    if (successType === 'success') {
      return (
        <Alert bsStyle={successType} className='feld'>{titleText}<ul><li>{recordsWithIdValueText}</li><li>{recordsImportableText}</li></ul></Alert>
      )
    }
    return (
      <Alert bsStyle={successType} className='feld'>{titleText}<ul><li>{recordsWithIdValueText}</li><li>{idsDuplicateText}</li><li>{recordsImportableText}</li><li>{recordsNotImportableText}</li></ul></Alert>
    )
  }
})
