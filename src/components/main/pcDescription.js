/*
 * when the property or relation collection's properties are shown in the form
 * the user sees a short description of the property collection at the top
 * the user can expand this description
 * this component creates it
 */

'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'PcDescription',

  propTypes: {
    pc: React.PropTypes.object,
    isVisible: React.PropTypes.bool
  },

  getInitialState () {
    return {
      isVisible: false
    }
  },

  onClick (event) {
    event.preventDefault()
    const isVisible = !this.state.isVisible
    this.setState({ isVisible })
  },

  render () {
    const { pc } = this.props
    const { isVisible } = this.state
    let mehr = ''

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

    let link = ''
    if (pc.Link) {
      link = (
        <div className='dsBeschreibungZeile'>
          <div>Link:</div>
          <div><a href={pc.Link} target={'_blank'}>{pc.Link}</a></div>
        </div>
      )
    }

    let importiertVon = ''
    if (pc['importiert von']) {
      importiertVon = (
        <div className='dsBeschreibungZeile'>
          <div>Importiert von:</div>
          <div><a href={'mailto:' + pc['importiert von']} target={'_blank'}>{pc['importiert von']}</a></div>
        </div>
      )
    }

    let ursprungsEs = ''
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
        <span>
          {<a href='#' onClick={this.onClick} className='showNextHidden'>{pc.Beschreibung ? (isVisible ? '...weniger' : '...mehr') : 'Beschreibung der Datensammlung anzeigen'}</a>}
          <div style={{display: isVisible ? 'block' : 'none'}}>
            {pc.Datenstand ? datenstand : ''}
            {pc.Nutzungsbedingungen ? nutzunbsbedingungen : ''}
            {pc.Link ? link : ''}
            {pc['importiert von'] ? importiertVon : ''}
            {pc.zusammenfassend ? ursprungsEs : ''}
          </div>
        </span>
      )
    }

    return (
      <div>
        <div className='Datensammlung beschreibungDatensammlung'>
          <span style={{marginRight: 3}}>{pc.Beschreibung}</span>
          {mehr}
        </div>
      </div>
    )
  }
})
