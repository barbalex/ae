'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputZusammenfassend',

  propTypes: {
    zusammenfassend: React.PropTypes.bool,
    onChangeZusammenfassend: React.PropTypes.func
  },

  onChange (event) {
    const zusammenfassend = event.target.checked
    this.props.onChangeZusammenfassend(zusammenfassend)
  },

  popover () {
    return (
      <Popover title='Was heisst "zusammenfassend"?'>
        <p>Die Informationen in einer zusammenfassenden Eigenschaftensammlung wurden aus mehreren eigenständigen Eigenschaftensammlungen zusammegefasst.</p>
        <p>Zweck: Jede Art bzw. jeder Lebensraum enthält die jeweils aktuellste Information zum Thema.</p>
        <p>Beispiel: Rote Liste.</p>
        <p>Mehr Infos <a href='https://github.com/FNSKtZH/artendb#zusammenfassende-pcs' target='_blank'>im Projektbeschrieb</a>.</p>
        <p><em>Tipp: Klicken Sie auf "zusammenfassend", damit diese Meldung offen bleibt.</em></p>
      </Popover>
    )
  },

  render () {
    const { zusammenfassend } = this.props

    return (
      <div className={'form-group'}>
        <OverlayTrigger trigger='click' rootClose placement='right' overlay={this.popover()}>
          <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.popover()}>
            <label className='control-label withPopover' htmlFor={'dsZusammenfassend'}>zusammenfassend</label>
          </OverlayTrigger>
        </OverlayTrigger>
        <input type='checkbox' label={'zusammenfassend'} checked={zusammenfassend} onChange={this.onChange} />
      </div>
    )
  }
})