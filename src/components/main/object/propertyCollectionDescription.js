/*
 * when the property collections properties are shown in the form
 * the user sees a short description of the property collection at the top
 * the user can expand this description
 * this component creates this description
 */

'use strict'

import React from 'react'
import { ListenerMixin } from 'reflux'
import { State } from 'react-router'
import Autolinker from 'autolinker'

export default function (esOderBs) {
  return React.createClass({
    displayName: 'EsBeschreibung',

    mixins: [ListenerMixin, State],

    propTypes: {
      esOderBs: React.PropTypes.object
    },

    getInitialState () {
      return {
        esOderBs: esOderBs
      }
    },

    render () {
      const esOderBs = this.state.esOderBs
      const mehr = ''

      const datenstand = (
        <div className='dsBeschreibungZeile'>
          <div>Stand:</div>
          <div>{esOderBs.Datenstand}</div>
        </div>
      )

      const nutzunbsbedingungen = (
        <div className='dsBeschreibungZeile'>
          <div>Nutzungs-<br/>bedingungen:</div>
          <div>{esOderBs.Nutzungsbedingungen}</div>
        </div>
      )

      const link = (
        <div className='dsBeschreibungZeile'>
          <div>Link:</div>
          <div>{Autolinker.link(esOderBs.Link)}</div>
        </div>
      )

      const importiertVon = (
        <div className='dsBeschreibungZeile'>
          <div>Importiert von:</div>
          <div>{Autolinker.link(esOderBs['importiert von'])}</div>
        </div>
      )

      const ursprungsEs = ''
      if (esOderBs.Ursprungsdatensammlung) {
        ursprungsEs = (
          <div className='dsBeschreibungZeile'>
            <div>Zus.-fassend:</div>
            <div>Diese Datensammlung fasst die Daten mehrerer Eigenschaftensammlungen in einer zusammen.<br/>Die angezeigten Informationen stammen aus der Eigenschaftensammlung {'"' + esOderBs.Ursprungsdatensammlung + '"'}</div>
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

      if (esOderBs.Datenstand || esOderBs.Nutzungsbedingungen || esOderBs.Link || (esOderBs.zusammenfassend && esOderBs.Ursprungsdatensammlung)) {
        mehr = (
          <div>
            {esOderBs.Beschreibung ? (<a href='#' className='showNextHidden'>...mehr</a>) : (<a href='#' className='showNextHidden'>Beschreibung der Datensammlung anzeigen</a>)}
            <div className='adb-hidden'>
              {esOderBs.Datenstand ? datenstand : ''}
              {esOderBs.Nutzungsbedingungen ? nutzunbsbedingungen : ''}
              {esOderBs.Link ? link : ''}
              {esOderBs['importiert von'] ? importiertVon : ''}
              {esOderBs.zusammenfassend ? ursprungsEs : ''}
            </div>
          </div>
        )
      }

      return (
        <div>
          <div className='Datensammlung beschreibungDatensammlung'>
            {esOderBs.Beschreibung}
            {mehr}
          </div>
        </div>
      )
    }
  })
}
