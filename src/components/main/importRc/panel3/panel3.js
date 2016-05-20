'use strict'

import React from 'react'
import AlertIdsAnalysisResult from './alertIdsAnalysisResult.js'
import InputImportFields from './inputImportFields.js'
import InputAeId from './inputAeId.js'

const Panel3 = ({
  idsAeIdField,
  idsNumberOfRecordsWithIdValue,
  idsNumberImportable,
  idsNotImportable,
  idsNotANumber,
  idsAnalysisComplete,
  idsWithoutPartner,
  rPartnerIdsToImport,
  rPartnerIdsImportable,
  idsImportIdField,
  rcsToImport,
  onChangeAeId,
  onChangeImportId
}) =>
  <div>
    {
      rcsToImport.length > 0 &&
      <InputImportFields
        idsImportIdField={idsImportIdField}
        rcsToImport={rcsToImport}
        onChangeImportId={onChangeImportId}
      />
    }
    <InputAeId
      idsAeIdField={idsAeIdField}
      onChangeAeId={onChangeAeId}
    />
    {
      idsImportIdField && idsAeIdField &&
      <AlertIdsAnalysisResult
        idsImportIdField={idsImportIdField}
        idsAeIdField={idsAeIdField}
        rcsToImport={rcsToImport}
        idsNumberOfRecordsWithIdValue={idsNumberOfRecordsWithIdValue}
        idsNumberImportable={idsNumberImportable}
        idsNotImportable={idsNotImportable}
        idsAnalysisComplete={idsAnalysisComplete}
        idsNotANumber={idsNotANumber}
        idsWithoutPartner={idsWithoutPartner}
        rPartnerIdsToImport={rPartnerIdsToImport}
        rPartnerIdsImportable={rPartnerIdsImportable}
      />
    }
  </div>

Panel3.displayName = 'Panel3'

Panel3.propTypes = {
  rcsToImport: React.PropTypes.array,
  idsImportIdField: React.PropTypes.string,
  idsAeIdField: React.PropTypes.string,
  idsAnalysisComplete: React.PropTypes.bool,
  idsNumberOfRecordsWithIdValue: React.PropTypes.number,
  idsNumberImportable: React.PropTypes.number,
  idsNotImportable: React.PropTypes.array,
  idsNotANumber: React.PropTypes.array,
  idsWithoutPartner: React.PropTypes.array,
  rPartnerIdsToImport: React.PropTypes.array,
  rPartnerIdsImportable: React.PropTypes.array,
  onChangeAeId: React.PropTypes.func,
  onChangeImportId: React.PropTypes.func
}

export default Panel3
