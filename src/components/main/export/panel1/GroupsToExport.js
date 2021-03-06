import React from 'react'
import { Checkbox } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  rootDiv: {
    paddingLeft: 8,
    paddingBottom: 8
  }
})

const GroupsToExport = ({
  groupsToExport,
  groups,
  onChangeGroupsToExport
}) => {
  groups.sort()
  const groupCheckboxes = groups.map((group, index) =>
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
    <div className={css(styles.rootDiv)}>
      {groupCheckboxes}
    </div>
  )
}

GroupsToExport.displayName = 'GroupsToExport'

GroupsToExport.propTypes = {
  groups: React.PropTypes.array,
  groupsToExport: React.PropTypes.array,
  onChangeGroupsToExport: React.PropTypes.func
}

export default GroupsToExport
