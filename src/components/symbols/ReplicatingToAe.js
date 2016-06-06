'use strict'

import React from 'react'
import { OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'

const ReplicatingToAe = ({ replicatingToAe, replicatingToAeTime }) => {
  let color = '#00AA00'
  let tooltipText = `Repliziere nach arteigenschaften.ch seit ${replicatingToAeTime}`
  if (replicatingToAe === 'success') {
    color = '#00AA00'
    tooltipText = `Zuletzt nach arteigenschaften.ch repliziert: ${replicatingToAeTime}`
  }
  if (replicatingToAe === 'error') {
    color = 'red'
    tooltipText = `Replikation nach arteigenschaften.ch gescheitert um: ${replicatingToAeTime}`
  }

  const styles = StyleSheet.create({
    glyph: {
      top: 2,
      fontSize: 16,
      paddingLeft: 5,
      color
    }
  })

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
        className={css(styles.glyph)}
        glyph="cloud-upload"
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
