'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputDatenstand',

  propTypes: {
    datenstand: React.PropTypes.string,
    validDatenstand: React.PropTypes.bool,
    onChangeDatenstand: React.PropTypes.func
  },

  onChange (event) {
    const datenstand = event.target.value
    // inform parent component
    this.props.onChangeDatenstand(datenstand)
  },

  popover() {
    return (
      <Popover id='InputDatenstandPopover' title='Wozu ein Datenstand?'>
        <p>Hier sieht der Nutzer, wann die Eigenschaftensammlung zuletzt aktualisiert wurde.</p>
      </Popover>
    )
  },

  render() {
    const { datenstand, validDatenstand } = this.props

    return (
      <div className={validDatenstand ? 'form-group' : 'form-group has-error'}>
        <OverlayTrigger trigger={['click', 'focus']} rootClose placement='right' overlay={this.popover()}>
          <label className='control-label withPopover'>Datenstand</label>
        </OverlayTrigger>
        <input type='textarea' className='form-control controls' rows={1} value={datenstand} onChange={this.onChange} />
        {validDatenstand ? null : <div className='validateDiv feld'>Ein Datenstand ist erforderlich</div>}
      </div>
    )
  }
})
