'use strict'

import React from 'react'
import { OverlayTrigger, Popover, Glyphicon } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ReplicatingToAe',

  render () {
    return (
      <OverlayTrigger
        trigger='hover'
        placement='left'
        overlay={
          <Popover>repliziere zu arteigenschaften.ch</Popover>
        }>
        <div id='replicateToAe'><Glyphicon glyph='cloud-upload'/></div>
      </OverlayTrigger>
    )
  }
})
