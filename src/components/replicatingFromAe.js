'use strict'

import React from 'react'
import { OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ReplicatingFromAe',

  propTypes: {
    replicatingFromAe: React.PropTypes.string,
    replicatingFromAeTime: React.PropTypes.string
  },

  render () {
    const { replicatingFromAe, replicatingFromAeTime } = this.props

    let style = {}
    let tooltipText = 'Repliziere von arteigenschaften.ch seit ' + replicatingFromAeTime
    if (replicatingFromAe === 'success') {
      style.color = '#00AA00'
      tooltipText = 'Zuletzt von arteigenschaften.ch repliziert: ' + replicatingFromAeTime
    }
    if (replicatingFromAe === 'error') {
      style.color = 'red'
      tooltipText = 'Replikation von arteigenschaften.ch gescheitert um: ' + replicatingFromAeTime
    }

    const tooltip = <Tooltip id='replicatingFromAeTooltip' bsStyle='info'>{tooltipText}</Tooltip>

    return (
      <OverlayTrigger placement='left' overlay={tooltip}>
        <Glyphicon id='replicateFromAe' className='symbols symbol' glyph='cloud-download' style={style}/>
      </OverlayTrigger>
    )
  }
})
