'use strict'

import React from 'react'
import hasClass from 'amp-has-class'
import toggleClass from 'amp-toggle-class'
import { StyleSheet, css } from 'aphrodite'
import { Tooltip, OverlayTrigger, Glyphicon, Button } from 'react-bootstrap'

const bodyElement = document.body

const styles = StyleSheet.create({
  rootDiv: {
    float: 'left',
    clear: 'both',
    width: '100%',
    marginBottom: 5
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
      <div className={css(styles.rootDiv)}>
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
            className="pull-right"
            bsSize="small"
            onClick={this.resize}
          >
            <Glyphicon glyph="resize-horizontal" />
          </Button>
        </OverlayTrigger>
      </div>
    )
  }
})
