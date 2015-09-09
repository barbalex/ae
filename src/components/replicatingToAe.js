'use strict'

import React from 'react'
import { OverlayTrigger, Popover, Glyphicon } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ReplicatingToAe',

  propTypes: {
    replicatingToAe: React.PropTypes.string
  },

  render () {
    const { replicatingToAe } = this.props

    let style = {}
    let popoverText = 'repliziere zu arteigenschaften.ch'
    if (replicatingToAe === 'success') {
      style.color = '#00AA00'
      popoverText = 'erfolgreich repliziert'
    }
    if (replicatingToAe === 'error') {
      style.color = 'red'
      popoverText = 'Replikation gescheitert'
    }

    return (
      <OverlayTrigger
        trigger='hover'
        placement='left'
        overlay={
          <Popover>{popoverText}</Popover>
        }>
        <div id='replicateToAe'><Glyphicon glyph='cloud-upload' style={style}/></div>
      </OverlayTrigger>
    )
  }
})
