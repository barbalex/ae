'use strict'

import React from 'react'
import $ from 'jquery'
import Button from 'react-bootstrap/lib/Button'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'

const bodyElement = $('body')

export default React.createClass({
  displayName: 'ResizeButton',

  resize () {
    bodyElement.toggleClass('force-mobile')
    this.forceUpdate()
  },

  render () {
    return (
      <OverlayTrigger
        placement='left'
        overlay={<Tooltip id='btnResizeTooltip'>{bodyElement.hasClass('force-mobile') ? 'in zwei Spalten anzeigen' : 'ganze Breite nutzen'}</Tooltip>}
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
