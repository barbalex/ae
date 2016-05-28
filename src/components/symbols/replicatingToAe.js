'use strict'

import React from 'react'
import { OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap'

const ReplicatingToAe = ({ replicatingToAe, replicatingToAeTime }) => {
  let style = {}
  let tooltipText = `Repliziere nach arteigenschaften.ch seit ${replicatingToAeTime}`
  if (replicatingToAe === 'success') {
    style.color = '#00AA00'
    tooltipText = `Zuletzt nach arteigenschaften.ch repliziert: ${replicatingToAeTime}`
  }
  if (replicatingToAe === 'error') {
    style.color = 'red'
    tooltipText = `Replikation nach arteigenschaften.ch gescheitert um: ${replicatingToAeTime}`
  }

  return (
    <OverlayTrigger
      placement="left"
      overlay={
        <Tooltip
          id="replicatingToAeTooltip"
          bsStyle="info"
        >
          {tooltipText}
        </Tooltip>
      }
    >
      <Glyphicon
        id="replicateToRemoteDb"
        className="symbols symbol"
        glyph="cloud-upload"
        style={style}
      />
    </OverlayTrigger>
  )
}

ReplicatingToAe.displayName = 'ReplicatingToAe'

ReplicatingToAe.propTypes = {
  replicatingToAe: React.PropTypes.string,
  replicatingToAeTime: React.PropTypes.string
}

export default ReplicatingToAe
