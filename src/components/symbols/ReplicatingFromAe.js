'use strict'

import React from 'react'
import { OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'

const ReplicatingFromAe = ({ replicatingFromAe, replicatingFromAeTime }) => {
  let tooltipText = `Repliziere von arteigenschaften.ch seit ${replicatingFromAeTime}`
  let color = '#00AA00'
  if (replicatingFromAe === 'success') {
    color = '#00AA00'
    tooltipText = `Zuletzt von arteigenschaften.ch repliziert: ${replicatingFromAeTime}`
  }
  if (replicatingFromAe === 'error') {
    color = 'red'
    tooltipText = `Replikation von arteigenschaften.ch gescheitert um: ${replicatingFromAeTime}`
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
          id="replicatingFromAeTooltip"
          bsStyle="info"
        >
          {tooltipText}
        </Tooltip>
      }
    >
      <Glyphicon
        id="replicateFromRemoteDb"
        className={css(styles.glyph)}
        glyph="cloud-download"
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
