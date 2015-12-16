'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputName',

  propTypes: {
    name: React.PropTypes.string,
    validName: React.PropTypes.bool,
    onChangeName: React.PropTypes.func,
    onBlurName: React.PropTypes.func
  },

  onChange (event) {
    const name = event.target.value
    this.props.onChangeName(name)
  },

  onBlur (event) {
    const name = event.target.value
    this.props.onBlurName(name)
  },

  popover () {
    return (
      <Popover id='inputNamePopover' title='So wählen Sie einen guten Namen:'>
        <p>Er sollte ungefähr dem ersten Teil eines Literaturzitats entsprechen. Beispiel: "Delarze (2008)".</p>
        <p>Danach sollte der Namen die Art der Beziehung ausdrücken. Beispiel: "Delarze (2008): Art charakterisiert Lebensraum"</p>
        <p>Wurden die Informationen spezifisch für einen bestimmten Kanton oder die ganze Schweiz erarbeitet?<br/>Wenn ja: Bitte das entsprechende Kürzel voranstellen. Beispiel: "CH Delarze (2008): Art charakterisiert Lebensraum".</p>
      </Popover>
    )
  },

  render () {
    const { name, validName } = this.props

    return (
      <div className={validName ? 'form-group' : 'form-group has-error'}>
        <OverlayTrigger trigger={['click', 'focus']} rootClose placement='right' overlay={this.popover()}>
          <label className='control-label withPopover'>Name</label>
        </OverlayTrigger>
        <input type='text' className='controls input-sm form-control' value={name} onChange={this.onChange} onBlur={this.onBlur} />
        {validName ? null : <div className='validateDiv feld'>Ein Name ist erforderlich</div>}
      </div>
    )
  }
})
