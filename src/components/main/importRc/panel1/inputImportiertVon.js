'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputImportiertVon',

  propTypes: {
    importiertVon: React.PropTypes.string
  },

  popover() {
    return (
      <Popover id='InputImportiertVonPopover'>
        <p>Das ist immer die Email des angemeldeten Benutzers</p>
      </Popover>
    )
  },

  render() {
    const { importiertVon } = this.props

    return (
      <div className='form-group'>
        <OverlayTrigger trigger={['click', 'focus']} rootClose placement='right' overlay={this.popover()}>
          <label className='control-label withPopover'>importiert von</label>
        </OverlayTrigger>
        <input type='text' className='form-control controls' value={importiertVon} disabled />
      </div>
    )
  }
})
