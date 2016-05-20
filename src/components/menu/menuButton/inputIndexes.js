'use strict'

import React from 'react'
import { Input, OverlayTrigger, Popover, Glyphicon } from 'react-bootstrap'

const popover = () =>
  <Popover id="inputIndexesPopover" title="Wozu lokale Indizes verwenden?">
    <p>Lokale Indizes sind mühsam:</p>
    <ul>
      <li>Browser und PC werden stark gefordert, um die Indizes aufzubauen</li>
      <li>
        Möglich, dass der Browser dabei abstürzt oder Sie eine Koffein-Vergiftung erleiden,
        bis die Indizes endlich fertig sind...
      </li>
      <li>Dies ist ein selten benötigtes und (möglicherweise zu) wenig getestetes Feature</li>
    </ul>
    <p>Sie sind aber nötig, wenn Sie:</p>
    <ul>
      <li>Daten importieren, die Sie nicht mit arteigenschaften.ch teilen möchten</li>
      <li>Ohne Internetanschluss importieren oder exportieren möchten</li>
    </ul>
  </Popover>

const liStyle = {
  paddingLeft: 20,
  paddingRight: 20
}
const cbStyle = {
  marginLeft: `${-20}px !important`
}
const glyphiconStyle = {
  paddingLeft: 5,
  fontSize: 16,
  top: 3
}

const InputIndexes = ({ offlineIndexes, onClickToggleOfflineIndexes }) =>
  <li style={liStyle}>
    <Input
      type="checkbox"
      label="Von arteigenschaften.ch verwenden (empfohlen)"
      checked={!offlineIndexes}
      onChange={onClickToggleOfflineIndexes}
      style={cbStyle}
    />
    <div
      className="checkbox"
    >
      <label
        className="control-label"
      >
        <input
          type="checkbox"
          checked={offlineIndexes}
          onChange={onClickToggleOfflineIndexes}
          style={cbStyle}
        />
          Lokale verwenden
        <OverlayTrigger
          trigger={['hover', 'focus']}
          rootClose
          placement="right"
          overlay={popover()}
        >
          <span
            className="withPopover"
          >
            <Glyphicon
              glyph="info-sign"
              style={glyphiconStyle}
            />
          </span>
        </OverlayTrigger>
      </label>
    </div>
  </li>

InputIndexes.displayName = 'InputIndexes'

InputIndexes.propTypes = {
  offlineIndexes: React.PropTypes.bool,
  onClickToggleOfflineIndexes: React.PropTypes.func
}

export default InputIndexes
