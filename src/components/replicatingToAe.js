'use strict'

import React from 'react'
import { OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ReplicatingToAe',

  propTypes: {
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string
  },

  render () {
    const { replicatingToAe, replicatingToAeTime } = this.props

    let style = {}
    let tooltipText = 'repliziere zu arteigenschaften.ch seit ' + replicatingToAeTime
    if (replicatingToAe === 'success') {
      style.color = '#00AA00'
      tooltipText = 'zuletzt repliziert: ' + replicatingToAeTime
    }
    if (replicatingToAe === 'error') {
      style.color = 'red'
      tooltipText = 'Replikation gescheitert um:' + replicatingToAeTime
    }

    const tooltip = <Tooltip bsStyle='default'>{tooltipText}</Tooltip>

    return (
      <OverlayTrigger placement='left' overlay={tooltip}>
        <div id='replicateToAe'><Glyphicon glyph='cloud-upload' style={style}/></div>
      </OverlayTrigger>
    )
  }
})
