'use strict'

import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const pStyle = {
  color: 'red',
  fontWeight: 500,
  cursor: 'progress'
}

const TcsQuerying = () =>
  <OverlayTrigger
    placement="left"
    overlay={
      <Tooltip
        id="tcsQueryingTooltip"
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
      Lade aktuelle Taxonomiensammlungen...
    </p>
  </OverlayTrigger>

TcsQuerying.displayName = 'TcsQuerying'

export default TcsQuerying
