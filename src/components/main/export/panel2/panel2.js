'use strict'

import React from 'react'
import WellSoGehtsFiltern from './wellSoGehtsFiltern.js'
import WellTippsTricksFiltern from './wellTippsTricksFiltern.js'
import FilterFields from './filterFields.js'

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
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func
  },

  render () {
    const { groupsLoadedOrLoading, groupsLoadingObjects, taxonomyFields, pcFields, relationFields, pcs, rcs, onChangeFilterField, onChangeCoSelect } = this.props
    const showFields = Object.keys(taxonomyFields).length > 0 || Object.keys(pcFields).length > 0 || Object.keys(relationFields).length > 0

    return (
      <div>
        <WellSoGehtsFiltern />
        <WellTippsTricksFiltern />
        {showFields ?
          <FilterFields
            taxonomyFields={taxonomyFields}
            pcFields={pcFields}
            pcs={pcs}
            relationFields={relationFields}
            rcs={rcs}
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
