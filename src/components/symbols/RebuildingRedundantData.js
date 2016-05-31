'use strict'

import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const pStyle = {
  color: 'red',
  fontWeight: 500,
  cursor: 'progress'
}

const RebuildingRedundantData = ({ rebuildingRedundantData }) =>
  <OverlayTrigger
    placement="left"
    overlay={
      <Tooltip
        id="rebuildingRedundantDataTooltip"
        bsStyle="info"
      >
        Bitte Geduld: Die App kann zeitweise einfrieren!
      </Tooltip>
    }
  >
    <p
      className="symbols text"
      style={pStyle}
    >
      {rebuildingRedundantData}
    </p>
  </OverlayTrigger>

RebuildingRedundantData.displayName = 'RebuildingRedundantData'

RebuildingRedundantData.propTypes = {
  rebuildingRedundantData: React.PropTypes.string
}

export default RebuildingRedundantData
