'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'

const GroupsToExport = ({ groupsToExport, groupsLoaded, onChangeGroupsToExport }) => {
  groupsLoaded.sort()
  const groupCheckboxes = groupsLoaded.map((group, index) => {
    const checked = groupsToExport.includes(group)
    return (
      <Input
        key={index}
        type="checkbox"
        label={group}
        checked={checked}
        onChange={(event) => onChangeGroupsToExport(group, event.target.checked)}
      />
    )
  })

  return (
    <div className="checkbox">
      {groupCheckboxes}
    </div>
  )
}

GroupsToExport.displayName = 'GroupsToExport'

GroupsToExport.propTypes = {
  groupsLoaded: React.PropTypes.array,
  groupsToExport: React.PropTypes.array,
  onChangeGroupsToExport: React.PropTypes.func
}

export default GroupsToExport
