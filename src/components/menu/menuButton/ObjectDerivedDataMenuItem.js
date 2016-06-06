'use strict'

import React from 'react'
import {
  MenuItem,
  OverlayTrigger,
  Popover,
  Glyphicon
} from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'
import rebuildRedundantData from '../../../modules/rebuildRedundantData.js'

const styles = StyleSheet.create({
  glyphicon: {
    paddingLeft: 5,
    fontSize: 16,
    top: 3
  }
})

const popover = () =>
  <Popover
    id="objectDerivedDataMenuItemPopover"
    title="Was heisst das?"
  >
    <p>
      Basierend auf den geladenen Objekten (Arten und Lebensräume)<br />
      baut die Anwendung redundante Daten auf:
    </p>
    <ul>
      <li>Taxonomie-Baum</li>
      <li>Suchbegriffe</li>
      <li>URL-Pfade für die Adresszeile des Browsers</li>
    </ul>
    <p>Diese Daten beschleunigen die Anwendung.</p>
    <p>
      Sie können jederzeit aus den Objekten neu aufgebaut werden.<br />
      Normalerweise sollte das aber nicht nötig sein.
    </p>
    <p>Nutzen Sie diesen Befehl, wenn Sie Fehler in den erwähnten Daten finden.</p>
  </Popover>

const ObjectDerivedDataMenuItem = () =>
  <MenuItem
    onClick={rebuildRedundantData}
  >
    Redundante Daten neu aufbauen
    <OverlayTrigger
      trigger={['hover', 'focus']}
      rootClose
      placement="right"
      overlay={popover()}
    >
      <Glyphicon
        glyph="info-sign"
        className={css(styles.glyphicon)}
      />
    </OverlayTrigger>
  </MenuItem>

ObjectDerivedDataMenuItem.displayName = 'ObjectDerivedDataMenuItem'

ObjectDerivedDataMenuItem.propTypes = {
  offlineIndexes: React.PropTypes.bool,
  onClickToggleOfflineIndexes: React.PropTypes.func
}

export default ObjectDerivedDataMenuItem
