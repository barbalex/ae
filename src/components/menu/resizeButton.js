'use strict'

import React from 'react'
import hasClass from 'amp-has-class'
import toggleClass from 'amp-toggle-class'
import { StyleSheet, css } from 'aphrodite'
import { Tooltip, OverlayTrigger, Glyphicon, Button } from 'react-bootstrap'

const bodyElement = document.body

const styles = StyleSheet.create({
  resizeButtonRootDiv: {
    float: 'left',
    clear: 'both',
    width: '100%',
    marginBottom: 5
  },
  button: {
    visibility: 'hidden',
    '@media screen and (min-width: 1001px)': {
      visibility: 'visible'
    },
    ':focus': {
      outline: 'none'
    }
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
      <div className={css(styles.resizeButtonRootDiv)}>
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
            className={[css(styles.button), 'pull-right'].join(' ')}
          >
            <Glyphicon glyph="resize-horizontal" />
          </Button>
        </OverlayTrigger>
      </div>
    )
  }
})
