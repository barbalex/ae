'use strict'

import React from 'react'
import hasClass from 'amp-has-class'
import toggleClass from 'amp-toggle-class'
import Button from 'react-bootstrap/lib/Button'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'

const bodyElement = document.body

export default React.createClass({
  displayName: 'ResizeButton',

  resize () {
    toggleClass(bodyElement, 'force-mobile')
    this.forceUpdate()
  },

  render () {
    return (
      <OverlayTrigger
        placement='left'
        overlay={<Tooltip id='btnResizeTooltip'>{hasClass(bodyElement, 'force-mobile') ? 'in zwei Spalten anzeigen' : 'ganze Breite nutzen'}</Tooltip>}
      >
        <Button
          id='btnResize'
          className='pull-right'
          bsSize='small'
          onClick={this.resize}>
          <span className='glyphicon glyphicon-resize-horizontal'></span>
        </Button>
      </OverlayTrigger>
    )
  }
})
