'use strict'

import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const tooltip = (
  <Tooltip
    id="rcsQueryingTooltip"
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

const RcsQuerying = () =>
  <OverlayTrigger
    placement="left"
    overlay={tooltip}
  >
    <p
      className="symbols text"
      style={pStyle}
    >
      Lade aktuelle Beziehungssammlungen...
    </p>
  </OverlayTrigger>

RcsQuerying.displayName = 'RcsQuerying'

export default RcsQuerying
