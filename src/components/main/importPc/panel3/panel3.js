'use strict'

import React from 'react'
import AlertIdsAnalysisResult from './alertIdsAnalysisResult.js'
import InputImportFields from './inputImportFields.js'
import InputAeId from './inputAeId.js'

export default React.createClass({
  displayName: 'Panel3',

  propTypes: {
    pcsToImport: React.PropTypes.array,
    idsImportIdField: React.PropTypes.string,
    idsAeIdField: React.PropTypes.string,
    idsAnalysisComplete: React.PropTypes.bool,
    idsNumberOfRecordsWithIdValue: React.PropTypes.number,
    idsDuplicate: React.PropTypes.array,
    idsNumberImportable: React.PropTypes.number,
    idsNotImportable: React.PropTypes.array,
    idsNotANumber: React.PropTypes.array,
    onChangeAeId: React.PropTypes.func,
    onChangeImportId: React.PropTypes.func
  },

  render () {
    const { onChangeAeId, onChangeImportId, pcsToImport, idsAeIdField, idsImportIdField, idsNumberOfRecordsWithIdValue, idsDuplicate, idsNumberImportable, idsNotImportable, idsNotANumber, idsAnalysisComplete } = this.props

    return (
      <div>
        {pcsToImport.length > 0 ? <InputImportFields idsImportIdField={idsImportIdField} pcsToImport={pcsToImport} onChangeImportId={onChangeImportId} /> : null}
        <InputAeId idsAeIdField={idsAeIdField} onChangeAeId={onChangeAeId} />
        {idsImportIdField && idsAeIdField ? <AlertIdsAnalysisResult idsImportIdField={idsImportIdField} idsAeIdField={idsAeIdField} pcsToImport={pcsToImport} idsNumberOfRecordsWithIdValue={idsNumberOfRecordsWithIdValue} idsDuplicate={idsDuplicate} idsNumberImportable={idsNumberImportable} idsNotImportable={idsNotImportable} idsAnalysisComplete={idsAnalysisComplete} idsNotANumber={idsNotANumber} /> : null}
      </div>
    )
  }
})
