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
    let tooltipText = 'Repliziere nach arteigenschaften.ch seit ' + replicatingToAeTime
    if (replicatingToAe === 'success') {
      style.color = '#00AA00'
      tooltipText = 'Zuletzt nach arteigenschaften.ch repliziert: ' + replicatingToAeTime
    }
    if (replicatingToAe === 'error') {
      style.color = 'red'
      tooltipText = 'Replikation nach arteigenschaften.ch gescheitert um: ' + replicatingToAeTime
    }

    const tooltip = <Tooltip id='replicatingToAeTooltip' bsStyle='info'>{tooltipText}</Tooltip>

    return (
      <OverlayTrigger placement='left' overlay={tooltip}>
        <Glyphicon id='replicateToRemoteDb' className='symbols symbol' glyph='cloud-upload' style={style}/>
      </OverlayTrigger>
    )
  }
})
