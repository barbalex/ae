'use strict'

import React from 'react'
import { OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap'

const ReplicatingFromAe = ({ replicatingFromAe, replicatingFromAeTime }) => {
  let style = {}
  let tooltipText = `Repliziere von arteigenschaften.ch seit ${replicatingFromAeTime}`
  if (replicatingFromAe === 'success') {
    style.color = '#00AA00'
    tooltipText = `Zuletzt von arteigenschaften.ch repliziert: ${replicatingFromAeTime}`
  }
  if (replicatingFromAe === 'error') {
    style.color = 'red'
    tooltipText = `Replikation von arteigenschaften.ch gescheitert um: ${replicatingFromAeTime}`
  }

  return (
    <OverlayTrigger
      placement="left"
      overlay={
        <Tooltip
          id="replicatingFromAeTooltip"
          bsStyle="info"
        >
          {tooltipText}
        </Tooltip>
      }
    >
      <Glyphicon
        id="replicateFromRemoteDb"
        className="symbols symbol"
        glyph="cloud-download"
        style={style}
      />
    </OverlayTrigger>
  )
}

ReplicatingFromAe.displayName = 'ReplicatingFromAe'

ReplicatingFromAe.propTypes = {
  replicatingFromAe: React.PropTypes.string,
  replicatingFromAeTime: React.PropTypes.string
}

export default ReplicatingFromAe
