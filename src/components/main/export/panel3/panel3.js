'use strict'

import React from 'react'
import WellSoGehts from './wellSoGehts.js'
import CheckboxOnlyObjectsWithCollectionData from './checkboxOnlyObjectsWithCollectionData.js'
import CheckboxIncludeDataFromSynonyms from './checkboxIncludeDataFromSynonyms.js'
import Fields from './fields.js'

export default React.createClass({
  displayName: 'Panel3',

  propTypes: {
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    exportOptions: React.PropTypes.object,
    pcs: React.PropTypes.array,
    rcs: React.PropTypes.array,
    onlyObjectsWithCollectionData: React.PropTypes.bool,
    includeDataFromSynonyms: React.PropTypes.bool,
    onChangeIncludeDataFromSynonyms: React.PropTypes.func,
    onChangeOnlyObjectsWithCollectionData: React.PropTypes.func,
    onChangeExportData: React.PropTypes.func,
    onChooseAllOfCollection: React.PropTypes.func
  },

  render () {
    const { taxonomyFields, pcFields, relationFields, pcs, rcs, exportOptions, onlyObjectsWithCollectionData, includeDataFromSynonyms, onChangeIncludeDataFromSynonyms, onChangeOnlyObjectsWithCollectionData, onChangeExportData, onChooseAllOfCollection } = this.props
    const showFields = Object.keys(taxonomyFields).length > 0 || Object.keys(pcFields).length > 0 || Object.keys(relationFields).length > 0

    return (
      <div>
        <WellSoGehts />
        <CheckboxOnlyObjectsWithCollectionData
          onlyObjectsWithCollectionData={onlyObjectsWithCollectionData}
          onChangeOnlyObjectsWithCollectionData={onChangeOnlyObjectsWithCollectionData} />
        <CheckboxIncludeDataFromSynonyms
          includeDataFromSynonyms={includeDataFromSynonyms}
          onChangeIncludeDataFromSynonyms={onChangeIncludeDataFromSynonyms} />
        {showFields ?
          <Fields
            exportOptions={exportOptions}
            taxonomyFields={taxonomyFields}
            pcFields={pcFields}
            pcs={pcs}
            relationFields={relationFields}
            rcs={rcs}
            onChangeExportData={onChangeExportData}
            onChooseAllOfCollection={onChooseAllOfCollection}
            onClickPanel={this.onClickPanel} />
          : null
        }
      </div>
    )
  }
})
