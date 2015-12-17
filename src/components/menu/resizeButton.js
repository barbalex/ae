'use strict'

import React from 'react'
import hasClass from 'amp-has-class'
import toggleClass from 'amp-toggle-class'
import { Tooltip, OverlayTrigger, Glyphicon, Button } from 'react-bootstrap'

const bodyElement = document.body

export default React.createClass({
  displayName: 'ResizeButton',

  resize () {
    toggleClass(bodyElement, 'force-mobile')
    this.forceUpdate()
  },

  tooltip () {
    return (
      <Tooltip
        id='btnResizeTooltip'>
        {hasClass(bodyElement, 'force-mobile') ? 'in zwei Spalten anzeigen' : 'ganze Breite nutzen'}
      </Tooltip>
    )
  },

  render () {
    return (
      <OverlayTrigger
        placement='left'
        overlay={this.tooltip()}
      >
        <Button
          id='btnResize'
          className='pull-right'
          bsSize='small'
          onClick={this.resize}>
          <Glyphicon glyph='resize-horizontal' />
        </Button>
      </OverlayTrigger>
    )
  }
})
