'use strict'

import React from 'react'
import { Input, OverlayTrigger, Popover } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ObjectDerivedDataMenuItem',

  propTypes: {
    offlineIndexes: React.PropTypes.bool,
    onClickToggleOfflineIndexes: React.PropTypes.func
  },

  popover () {
    return (
      <Popover id='objectDerivedDataMenuItemPopover' title='Was heisst das?'>
        <p>Basierend auf den geladenen Gruppen werden lokal Daten aufgebaut, z.B.:</p>
        <ul>
          <li>der Taxonomie-Baum</li>
          <li>Suchbegriffe</li>
          <li>URL-Pfade</li>
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
    const cbStyle = {
      marginLeft: -20 + 'px !important'
    }

    return (
      <li style={liStyle}>
        <Input type='checkbox' label='Von arteigenschaften.ch verwenden (empfohlen)' checked={!offlineIndexes} onChange={onClickToggleOfflineIndexes} style={cbStyle} />
        <div className='checkbox'>
          <label className='control-label'>
            <input type='checkbox' checked={offlineIndexes} onChange={onClickToggleOfflineIndexes} style={cbStyle} />
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
