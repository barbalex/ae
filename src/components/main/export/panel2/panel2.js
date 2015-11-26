'use strict'

import React from 'react'
import WellSoGehts from './wellSoGehts.js'
import WellTippsTricks from './wellTippsTricks.js'
import CheckboxOnlyObjectsWithCollectionData from './checkboxOnlyObjectsWithCollectionData.js'
import Fields from './fields.js'

export default React.createClass({
  displayName: 'Panel2',

  propTypes: {
    groupsLoadingObjects: React.PropTypes.array,
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    groupsLoadedOrLoading: React.PropTypes.array,
    pcs: React.PropTypes.array,
    rcs: React.PropTypes.array,
    exportOptions: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func,
    onChangeOnlyObjectsWithCollectionData: React.PropTypes.func,
    onlyObjectsWithCollectionData: React.PropTypes.bool
  },

  render () {
    const { groupsLoadedOrLoading, groupsLoadingObjects, taxonomyFields, pcFields, relationFields, pcs, rcs, exportOptions, onChangeFilterField, onChangeCoSelect, onlyObjectsWithCollectionData, onChangeOnlyObjectsWithCollectionData } = this.props
    const showFields = Object.keys(taxonomyFields).length > 0 || Object.keys(pcFields).length > 0 || Object.keys(relationFields).length > 0

    return (
      <div>
        <WellSoGehts />
        <WellTippsTricks />
        <CheckboxOnlyObjectsWithCollectionData
          onlyObjectsWithCollectionData={onlyObjectsWithCollectionData}
          onChangeOnlyObjectsWithCollectionData={onChangeOnlyObjectsWithCollectionData} />
        {
          showFields
          ? <Fields
              taxonomyFields={taxonomyFields}
              pcFields={pcFields}
              pcs={pcs}
              relationFields={relationFields}
              rcs={rcs}
              exportOptions={exportOptions}
              groupsLoadedOrLoading={groupsLoadedOrLoading}
              groupsLoadingObjects={groupsLoadingObjects}
              onChangeFilterField={onChangeFilterField}
              onChangeCoSelect={onChangeCoSelect} />
          : null
        }
      </div>
    )
  }
})
