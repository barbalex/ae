/*
 * get: aeIdField, importIdField, pcsToImport
 * return alert
 */
'use strict'

import app from 'ampersand-app'
import React from 'react'
import _ from 'lodash'
import { Alert } from 'react-bootstrap'
import queryFauna from '../../../queries/faunaById.js'
import queryFlora from '../../../queries/floraById.js'
import queryMoose from '../../../queries/mooseById.js'
import queryMacromycetes from '../../../queries/macromycetesById.js'

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

  getDocs () {
    const { aeIdField, importIdField, pcsToImport } = this.props
    const ids = _.pluck(pcsToImport, importIdField)
    // build object of functions, to call dynamically
    let dynamicFuntions = {
      Fauna: queryFauna,
      Flora: queryFlora,
      Moose: queryMoose,
      Macromycetes: queryMacromycetes
    }
    return new Promise(function (resolve, reject) {
      // call the apropriate view and pass the ids
      // by taxonomie id: viewname = Gruppe.toLowerCase() + ById
      // guid: allDocs
      if (aeIdField === 'GUID') {
        const options = {
          keys: ids,
          include_docs: true
        }
        app.localDb.allDocs(options)
          .then(function (result) {
            const docs = _.pluck(result.rows, 'doc')
            resolve(docs)
          })
          .catch(function (error) {
            reject('error fetching docs', error)
          })
      } else {
        dynamicFuntions[aeIdField](ids)
          .then(function (docs) {
            resolve(docs)
          })
          .catch(function (error) {
            reject('error fetching docs', error)
          })
      }
    })
  },

  componentDidMount () {
    const { aeIdField, pcsToImport, importIdField, onChangeIdsAnalysisResult } = this.props
    const that = this
    // TODO: start analysis
    // test if some id's exist more than once (> warning)
    this.getDocs()
      .then(function (objectsToImportPcsInTo) {
        // console.log('objectsToImportPcsInTo', objectsToImportPcsInTo)
        const idsToImportWithDuplicates = _.pluck(pcsToImport, importIdField)
        // TODO: THESE ARE STRINGS
        const idsToImport = _.unique(idsToImportWithDuplicates)
        const recordsWithIdValueCount = idsToImportWithDuplicates.length
        const idsDuplicate = _.difference(idsToImportWithDuplicates, idsToImport)
        // find out, which id's did not fetch an object
        const idAttribute = aeIdField === 'GUID' ? '_id' : 'Taxonomien[0].Eigenschaften["Taxonomie ID"]'
        const idsFetched = _.pluck(objectsToImportPcsInTo, idAttribute)
        const idsImportable = _.intersection(idsToImport, idsFetched)
        const idsImportableCount = idsImportable.length
        const idsNotImportable = _.difference(idsToImport, idsFetched)

        // finisched? render and call onChangeIdsAnalysisResult and pass it sucess type and objectsToImportPcsInTo
        console.log('recordsWithIdValueCount', recordsWithIdValueCount)
        console.log('idsDuplicate', idsDuplicate)
        console.log('idsToImport', idsToImport)
        console.log('idsFetched', idsFetched)
        console.log('idsImportableCount', idsImportableCount)
        console.log('idsNotImportable', idsNotImportable)
        that.setState({
          recordsWithIdValueCount: recordsWithIdValueCount,
          idsDuplicate: idsDuplicate,
          idsImportableCount: idsImportableCount,
          idsNotImportable: idsNotImportable,
          analysisComplete: true
        })
        console.log('2')
        const idsAnalysisResultType = that.getSuccessType()
        console.log('3')
        onChangeIdsAnalysisResult(idsAnalysisResultType, objectsToImportPcsInTo)
      })
      .catch(function (error) {
        console.log(error)
      })

  },

  getSuccessType () {
    const { pcsToImport, idsImportableCount, idsNotImportable, idsDuplicate } = this.state
    if (idsNotImportable > 0) return 'error'
    console.log('idsDuplicate.length', idsDuplicate.length)
    console.log('pcsToImport.length', pcsToImport.length)
    if ((idsImportableCount < pcsToImport.length) || idsDuplicate.length > 0) return 'warning'
    return 'success'
  },

  render () {
    const { analysisComplete, pcsToImport, recordsWithIdValueCount, importIdField, idsImportableCount, idsNotImportable, idsDuplicate } = this.state

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
        <Alert bsStyle={successType} className='feld'>{titleText} + '<ul><li>' + recordsWithIdValueText + '</li><li>' + recordsImportableText + '</li></ul>'</Alert>
      )
    }
    return (
      <Alert bsStyle={successType} className='feld'>{titleText} + '<ul><li>' + recordsWithIdValueText + '</li><li>' + idsDuplicateText + '</li><li>' + recordsImportableText + '</li><li>' + recordsNotImportableText + '</li></ul>'</Alert>
    )
  }
})
