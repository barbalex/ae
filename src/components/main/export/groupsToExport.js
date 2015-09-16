'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'
import _ from 'lodash'

export default React.createClass({
  displayName: 'GroupsToExport',

  propTypes: {
    groupsLoadedOrLoading: React.PropTypes.array,
    groupsToExport: React.PropTypes.array,
    onChangeGroupsToExport: React.PropTypes.func
  },

  onChangeGroup (group, event) {
    const { onChangeGroupsToExport } = this.props
    const checked = event.target.checked
    onChangeGroupsToExport(group, checked)
  },

  render () {
    const { groupsToExport, groupsLoadedOrLoading } = this.props

    const groupCheckboxes = groupsLoadedOrLoading.map((group, index) => {
      const checked = _.includes(groupsToExport, group)
      return <Input key={index} type='checkbox' label={group} checked={checked} onChange={this.onChangeGroup.bind(this, group)} />
    })

    return (
      <div className='checkbox'>
        {groupCheckboxes}
      </div>
    )
  }

})
