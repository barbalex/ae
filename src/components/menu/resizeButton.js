'use strict'

import React from 'react'
import $ from 'jquery'
import Button from 'react-bootstrap/lib/Button'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'

// let windowHeight = $(window).height()
const bodyElement = $('body')

export default React.createClass({
  displayName: 'ResizeButton',

  resize () {
    bodyElement.toggleClass('force-mobile')
    // TODO: manage max-height of tree when toggling
    // so form can always be reached and dragged up
    /* previosly:
    if ($body.hasClass('force-mobile')) {
      // Spalten sind untereinander. Baum 91px weniger hoch, damit Formulare zum raufschieben immer erreicht werden können
      $('.baum').css('max-height', windowHeight - 252)
    } else {
      $('.baum').css('max-height', windowHeight - 161)
    }*/
    this.forceUpdate()
  },

  render () {
    return (
      <OverlayTrigger
        placement='left'
        overlay={<Tooltip>{bodyElement.hasClass('force-mobile') ? 'in zwei Spalten anzeigen' : 'ganze Breite nutzen'}</Tooltip>}
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
