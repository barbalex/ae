'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'GroupsToExport',

  propTypes: {
    groupsLoaded: React.PropTypes.array,
    groupsToExport: React.PropTypes.array,
    onChangeGroupsToExport: React.PropTypes.func
  },

  onChangeGroup (group, event) {
    const { onChangeGroupsToExport } = this.props
    const checked = event.target.checked
    onChangeGroupsToExport(group, checked)
  },

  render() {
    const { groupsToExport } = this.props
    let { groupsLoaded } = this.props

    groupsLoaded.sort()
    const groupCheckboxes = groupsLoaded.map((group, index) => {
      const checked = groupsToExport.includes(group)
      return (
        <Input
          key={index}
          type='checkbox'
          label={group}
          checked={checked}
          onChange={this.onChangeGroup.bind(this, group)} />
      )
    })

    return (
      <div className='checkbox'>
        {groupCheckboxes}
      </div>
    )
  }
})
