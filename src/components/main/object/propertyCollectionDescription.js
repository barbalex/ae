/*
 * when the property or relation collection's properties are shown in the form
 * the user sees a short description of the property collection at the top
 * the user can expand this description
 * this component creates this description
 */

'use strict'

import React from 'react'
import { ListenerMixin } from 'reflux'
import { State } from 'react-router'
import Autolinker from 'autolinker'

export default React.createClass({
  displayName: 'EsBeschreibung',

  mixins: [ListenerMixin, State],

  propTypes: {
    pc: React.PropTypes.object
  },

  getInitialState () {
    return {
      pc: this.props.pc
    }
  },

  render () {
    const pc = this.state.pc
    const mehr = ''

    const datenstand = (
      <div className='dsBeschreibungZeile'>
        <div>Stand:</div>
        <div>{pc.Datenstand}</div>
      </div>
    )

    const nutzunbsbedingungen = (
      <div className='dsBeschreibungZeile'>
        <div>Nutzungs-<br/>bedingungen:</div>
        <div>{pc.Nutzungsbedingungen}</div>
      </div>
    )

    const link = (
      <div className='dsBeschreibungZeile'>
        <div>Link:</div>
        <div>{Autolinker.link(pc.Link)}</div>
      </div>
    )

    const importiertVon = (
      <div className='dsBeschreibungZeile'>
        <div>Importiert von:</div>
        <div>{Autolinker.link(pc['importiert von'])}</div>
      </div>
    )

    const ursprungsEs = ''
    if (pc.Ursprungsdatensammlung) {
      ursprungsEs = (
        <div className='dsBeschreibungZeile'>
          <div>Zus.-fassend:</div>
          <div>Diese Datensammlung fasst die Daten mehrerer Eigenschaftensammlungen in einer zusammen.<br/>Die angezeigten Informationen stammen aus der Eigenschaftensammlung {'"' + pc.Ursprungsdatensammlung + '"'}</div>
        </div>
      )
    } else {
      ursprungsEs = (
        <div className='dsBeschreibungZeile'>
          <div>Zus.-fassend:</div>
          <div>Diese Datensammlung fasst die Daten mehrerer Eigenschaftensammlungen in einer zusammen.<br/>Bei den angezeigten Informationen ist die Ursprungs-Eigenschaftensammlung leider nicht beschrieben</div>
        </div>
      )
    }

    if (pc.Datenstand || pc.Nutzungsbedingungen || pc.Link || (pc.zusammenfassend && pc.Ursprungsdatensammlung)) {
      mehr = (
        <div>
          {pc.Beschreibung ? (<a href='#' className='showNextHidden'>...mehr</a>) : (<a href='#' className='showNextHidden'>Beschreibung der Datensammlung anzeigen</a>)}
          <div className='adb-hidden'>
            {pc.Datenstand ? datenstand : ''}
            {pc.Nutzungsbedingungen ? nutzunbsbedingungen : ''}
            {pc.Link ? link : ''}
            {pc['importiert von'] ? importiertVon : ''}
            {pc.zusammenfassend ? ursprungsEs : ''}
          </div>
        </div>
      )
    }

    return (
      <div>
        <div className='Datensammlung beschreibungDatensammlung'>
          {pc.Beschreibung}
          {mehr}
        </div>
      </div>
    )
  }
})
