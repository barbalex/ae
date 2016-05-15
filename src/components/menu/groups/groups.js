'use strict'

import React from 'react'
import { difference } from 'lodash'
import GroupCheckbox from './groupCheckbox.js'
import getGruppen from '../../../modules/gruppen.js'

const gruppen = getGruppen()

export default React.createClass({
  displayName: 'Groups',

  propTypes: {
    groupsLoadedOrLoading: React.PropTypes.array
  },

  render() {
    const { groupsLoadedOrLoading } = this.props
    const groupsNotLoaded = difference(gruppen, groupsLoadedOrLoading)
    const groupCheckboxes = groupsNotLoaded.map((group, index) => <GroupCheckbox key={group} group={group} />)

    return (
      <div id='groups'>
        <div id='groupCheckboxesTitle'>
          Gruppen laden:
        </div>
        <div id='groupCheckboxes'>
          {groupCheckboxes}
        </div>
      </div>
    )
  }
})
