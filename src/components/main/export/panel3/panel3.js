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
    onChooseField: React.PropTypes.func,
    onChooseAllOfCollection: React.PropTypes.func,
    collectionsWithAllChoosen: React.PropTypes.array
  },

  render () {
    const { taxonomyFields, pcFields, relationFields, pcs, rcs, exportOptions, onlyObjectsWithCollectionData, includeDataFromSynonyms, onChangeIncludeDataFromSynonyms, onChangeOnlyObjectsWithCollectionData, onChooseField, onChooseAllOfCollection, collectionsWithAllChoosen } = this.props

    return (
      <div>
        <WellSoGehts />
        <CheckboxOnlyObjectsWithCollectionData
          onlyObjectsWithCollectionData={onlyObjectsWithCollectionData}
          onChangeOnlyObjectsWithCollectionData={onChangeOnlyObjectsWithCollectionData} />
        <CheckboxIncludeDataFromSynonyms
          includeDataFromSynonyms={includeDataFromSynonyms}
          onChangeIncludeDataFromSynonyms={onChangeIncludeDataFromSynonyms} />
        <Fields
          exportOptions={exportOptions}
          taxonomyFields={taxonomyFields}
          pcFields={pcFields}
          pcs={pcs}
          relationFields={relationFields}
          rcs={rcs}
          collectionsWithAllChoosen={collectionsWithAllChoosen}
          onChooseField={onChooseField}
          onChooseAllOfCollection={onChooseAllOfCollection}
          onClickPanel={this.onClickPanel} />
      </div>
    )
  }
})
