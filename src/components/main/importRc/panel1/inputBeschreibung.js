'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputBeschreibung',

  propTypes: {
    beschreibung: React.PropTypes.string,
    validBeschreibung: React.PropTypes.bool,
    onChangeBeschreibung: React.PropTypes.func
  },

  onChange(event) {
    const beschreibung = event.target.value
    // inform parent component
    this.props.onChangeBeschreibung(beschreibung)
  },

  popover() {
    return (
      <Popover id='InputBeschreibungPopover' title='So beschreiben Sie die Sammlung:'>
        <p>Die Beschreibung sollte im ersten Teil etwa einem klassischen Literaturzitat entsprechen.<br/>
          Beispiel: "Delarze R. & Gonseth Y. (2008): Lebensräume der Schweiz".</p>
        <p>In einem zweiten Teil sollte beschrieben werden, welche Informationen die Datensammlung enthält.<br/>
          Beispiel: "Delarze R. & Gonseth Y. (2008): Lebensräume der Schweiz. 791 Beziehungen zwischen 279 Lebensräumen und Tierarten".</p>
        <p>Es kann sehr nützlich sein, zu wissen, wozu die Informationen zusammengestellt wurden.</p>
      </Popover>
    )
  },

  render() {
    const { beschreibung, validBeschreibung } = this.props

    return (
      <div className={validBeschreibung ? 'form-group' : 'form-group has-error'}>
        <OverlayTrigger trigger={['click', 'focus']} rootClose placement='right' overlay={this.popover()}>
          <label className='control-label withPopover'>Beschreibung</label>
        </OverlayTrigger>
        <input type='textarea' className='form-control controls' value={beschreibung} onChange={this.onChange} rows={1} />
        {validBeschreibung ? null : <div className='validateDiv feld'>Eine Beschreibung ist erforderlich</div>}
      </div>
    )
  }
})
