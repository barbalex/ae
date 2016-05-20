'use strict'

import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const tooltip = (
  <Tooltip
    id="fieldsQueryingTooltip"
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

const FieldsQuerying = () =>
  <OverlayTrigger
    placement="left"
    overlay={tooltip}
  >
    <p
      className="symbols text"
      style={pStyle}
    >
      Lade aktuelle Felder...
    </p>
  </OverlayTrigger>

FieldsQuerying.displayName = 'FieldsQuerying'

export default FieldsQuerying
