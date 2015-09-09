'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Input } from 'react-bootstrap'
import _ from 'lodash'
import getGruppen from '../../modules/gruppen.js'

const gruppen = getGruppen()

export default React.createClass({
  displayName: 'Gruppen',

  propTypes: {
    groupsLoadedOrLoading: React.PropTypes.array
  },

  onClickGruppe (gruppe) {
    app.Actions.loadObjectStore(gruppe)
  },

  groupCheckboxes () {
    const { groupsLoadedOrLoading } = this.props
    const groupsNotLoaded = _.difference(gruppen, groupsLoadedOrLoading)
    return groupsNotLoaded.map((gruppe, index) => {
      const label = gruppe.replace('Macromycetes', 'Pilze')
      return (
        <Input
          key={index}
          type='checkbox'
          label={label}
          onClick={this.onClickGruppe.bind(this, gruppe)} />
      )
    })
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
