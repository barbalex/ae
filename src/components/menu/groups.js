'use strict'

import app from 'ampersand-app'
import React from 'react'
import _ from 'lodash'
import GroupCheckbox from './groupCheckbox.js'
import getGruppen from '../../modules/gruppen.js'

const gruppen = getGruppen()

export default React.createClass({
  displayName: 'Gruppen',

  propTypes: {
    groupsLoadedOrLoading: React.PropTypes.array
  },

  groupCheckboxes () {
    const { groupsLoadedOrLoading } = this.props
    const groupsNotLoaded = _.difference(gruppen, groupsLoadedOrLoading)
    return groupsNotLoaded.map((gruppe, index) => <GroupCheckbox key={index} group={gruppe} />)
  },

  render () {
    // MenuButton needs to be outside of the menu
    // otherwise the menu can't be shown outside when menu is short
    return (
      <div id='groups'>
        <div id='groupCheckboxesTitle'>
          Gruppen laden:
        </div>
        <div id='groupCheckboxes'>
          {this.groupCheckboxes()}
        </div>
      </div>
    )
  }
})
