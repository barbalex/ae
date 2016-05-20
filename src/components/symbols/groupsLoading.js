'use strict'

import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const tooltip = (
  <Tooltip
    id="groupsLoadingTooltip"
    bsStyle="info"
  >
    Bitte Geduld: Die App kann zeitweise einfrieren!
  </Tooltip>
)
const pStyle = {
  color: 'red',
  fontWeight: 500,
  cursor: 'progress'
}

const GroupsLoading = ({ groupsLoadingObjects }) =>
  <OverlayTrigger
    placement="left"
    overlay={tooltip}
  >
    <p
      className="symbols text"
      style={pStyle}
    >
      {groupsLoadingObjects.length > 1 ? 'Lade Gruppen...' : 'Lade Gruppe...'}
    </p>
  </OverlayTrigger>

GroupsLoading.displayName = 'GroupsLoading'

GroupsLoading.propTypes = {
  groupsLoadingObjects: React.PropTypes.array
}

export default GroupsLoading
