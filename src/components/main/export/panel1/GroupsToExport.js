'use strict'

import React from 'react'
import { Checkbox } from 'react-bootstrap'

const GroupsToExport = ({
  groupsToExport,
  groupsLoaded,
  onChangeGroupsToExport
}) => {
  groupsLoaded.sort()
  const groupCheckboxes = groupsLoaded.map((group, index) =>
    <Checkbox
      key={index}
      checked={groupsToExport.includes(group)}
      onChange={(event) =>
        onChangeGroupsToExport(group, event.target.checked)
      }
      className="groupToExport"
    >
      {group}
    </Checkbox>
  )

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
