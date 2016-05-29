'use strict'

import React from 'react'
import hasClass from 'amp-has-class'
import toggleClass from 'amp-toggle-class'
import { StyleSheet, css } from 'aphrodite'
import { Tooltip, OverlayTrigger, Glyphicon, Button } from 'react-bootstrap'

const bodyElement = document.body

const styles = StyleSheet.create({
  button: {
    visibility: 'hidden',
    '@media screen and (min-width: 1001px)': {
      visibility: 'visible'
    },
    ':focus': {
      outline: 'none'
    },
    height: 30
  }
})

export default React.createClass({
  displayName: 'ResizeButton',

  resize() {
    toggleClass(bodyElement, 'force-mobile')
    this.forceUpdate()
  },

  render() {
    return (
      <OverlayTrigger
        placement="left"
        overlay={
          <Tooltip
            id="btnResizeTooltip"
          >
            {
              hasClass(bodyElement, 'force-mobile') ?
              'in zwei Spalten anzeigen' :
              'ganze Breite nutzen'
            }
          </Tooltip>
        }
      >
        <Button
          id="btnResize"
          bsSize="small"
          onClick={this.resize}
          className={css(styles.button)}
        >
          <Glyphicon glyph="resize-horizontal" />
        </Button>
      </OverlayTrigger>
    )
  }
})
