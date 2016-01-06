'use strict'

import React from 'react'
import { MenuItem, OverlayTrigger, Popover, Glyphicon } from 'react-bootstrap'
import rebuildRedundantData from '../../../modules/rebuildRedundantData.js'

export default React.createClass({
  displayName: 'ObjectDerivedDataMenuItem',

  propTypes: {
    offlineIndexes: React.PropTypes.bool,
    onClickToggleOfflineIndexes: React.PropTypes.func
  },

  rebuildRedundantData () {
    rebuildRedundantData()
  },

  popover () {
    return (
      <Popover id='objectDerivedDataMenuItemPopover' title='Was heisst das?'>
        <p>Basierend auf den geladenen Objekten (Arten und Lebensräume)<br />
          baut die Anwendung redundante Daten auf:</p>
        <ul>
          <li>Taxonomie-Baum</li>
          <li>Suchbegriffe</li>
          <li>URL-Pfade für die Adresszeile des Browsers</li>
        </ul>
        <p>Diese Daten beschleunigen die Anwendung.</p>
        <p>Sie können jederzeit aus den Objekten neu aufgebaut werden.<br />
          Normalerweise sollte das aber nicht nötig sein.</p>
        <p>Nutzen Sie diesen Befehl, wenn Sie Fehler in den erwähnten Daten finden.</p>
      </Popover>
    )
  },

  render () {
    const glyphiconStyle = {
      paddingLeft: 5,
      fontSize: 16,
      top: 3
    }
    return (
      <MenuItem
        onClick={this.rebuildRedundantData}>
        Redundante Daten neu aufbauen
        <OverlayTrigger
          trigger={['hover', 'focus']}
          rootClose
          placement='right'
          overlay={this.popover()}>
          <span
            className='withPopover'>
            <Glyphicon
              glyph='info-sign'
              style={glyphiconStyle} />
          </span>
        </OverlayTrigger>
      </MenuItem>
    )
  }
})
