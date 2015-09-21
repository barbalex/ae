'use strict'

import React from 'react'
import { Input, OverlayTrigger, Popover } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputIndexes',

  propTypes: {
    offlineIndexes: React.PropTypes.bool,
    onClickToggleOfflineIndexes: React.PropTypes.func
  },

  popover () {
    return (
      <Popover id='inputIndexesPopover' title='Wozu lokale Indizes verwenden?'>
        <p>Lokale Indizes sind mühsam:</p>
        <ul>
          <li>Browser und PC werden stark gefordert, um die Indizes aufzubauen</li>
          <li>Möglich, dass der Browser dabei abstürzt oder Sie eine Koffein-Vergiftung erleiden, bis die Indizes endlich fertig sind...</li>
        </ul>
        <p>Sie sind aber nötig, wenn Sie:</p>
        <ul>
          <li>Daten importieren, die Sie nicht mit arteigenschaften.ch teilen möchten</li>
          <li>Ohne Internetanschluss importieren oder exportieren möchten</li>
        </ul>
      </Popover>
    )
  },

  render () {
    const { offlineIndexes, onClickToggleOfflineIndexes } = this.props
    const liStyle = {
      paddingLeft: 20,
      paddingRight: 20
    }

    return (
      <li style={liStyle}>
        <Input type='checkbox' label='Von arteigenschaften.ch verwenden (empfohlen)' checked={!offlineIndexes} onChange={onClickToggleOfflineIndexes} />
        <div className='checkbox'>
          <label className='control-label'>
            <input type='checkbox' checked={offlineIndexes} onChange={onClickToggleOfflineIndexes} />
              lokale verwenden<br />(
                <OverlayTrigger trigger={['hover', 'focus']} rootClose placement='right' overlay={this.popover()}>
                  <span className='withPopover'>bitte vorher lesen</span>
                </OverlayTrigger>
              )
          </label>
        </div>
      </li>
    )
  }
})