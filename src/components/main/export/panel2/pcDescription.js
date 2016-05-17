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

  getInitialState() {
    return {
      isVisible: false
    }
  },

  onClick(event) {
    event.preventDefault()
    const isVisible = !this.state.isVisible
    this.setState({ isVisible })
  },

  render() {
    const { pc } = this.props
    const { isVisible } = this.state
    let mehr = ''

    const datenstand = (
      <div
        className='dsBeschreibungZeile'
      >
        <div>Stand:</div>
        <div>{pc.fields.Datenstand}</div>
      </div>
    )

    const nutzunbsbedingungen = (
      <div className='dsBeschreibungZeile'>
        <div>Nutzungs-<br />bedingungen:</div>
        <div>{pc.fields.Nutzungsbedingungen}</div>
      </div>
    )

    let link = ''
    if (pc.fields.Link) {
      link = (
        <div className='dsBeschreibungZeile'>
          <div>Link:</div>
          <div><a href={pc.fields.Link} target={'_blank'}>{pc.fields.Link}</a></div>
        </div>
      )
    }

    let importiertVon = ''
    if (pc.fields['importiert von']) {
      importiertVon = (
        <div className='dsBeschreibungZeile'>
          <div>Importiert von:</div>
          <div>
            <a
              href={`mailto:${pc.fields['importiert von']}`}
              target={'_blank'}
            >
              {pc.fields['importiert von']}
            </a>
          </div>
        </div>
      )
    }

    let ursprungsEs = ''
    if (pc.fields.Ursprungsdatensammlung) {
      ursprungsEs = (
        <div className='dsBeschreibungZeile'>
          <div>Zus.-fassend:</div>
          <div>
            Diese Eigenschaftensammlung fasst die Daten mehrerer Eigenschaftensammlungen in einer zusammen.<br />
            Die angezeigten Informationen stammen aus der Eigenschaftensammlung {`"${pc.fields.Ursprungsdatensammlung}"`}
          </div>
        </div>
      )
    } else {
      ursprungsEs = (
        <div className='dsBeschreibungZeile'>
          <div>Zus.-fassend:</div>
          <div>Diese Eigenschaftensammlung fasst die Daten mehrerer Eigenschaftensammlungen in einer zusammen.<br/>Bei den angezeigten Informationen ist die Ursprungs-Eigenschaftensammlung leider nicht beschrieben</div>
        </div>
      )
    }

    if (pc.fields.Datenstand || pc.fields.Nutzungsbedingungen || pc.fields.Link || (pc.combining && pc.fields.Ursprungsdatensammlung)) {
      mehr = (
        <span>
          <a href='#' onClick={this.onClick} className='showNextHidden'>{isVisible ? '...weniger' : '...mehr'}</a>
          <div style={{display: isVisible ? 'block' : 'none'}}>
            {pc.fields.Datenstand ? datenstand : null}
            {pc.fields.Nutzungsbedingungen ? nutzunbsbedingungen : null}
            {pc.fields.Link ? link : null}
            {pc.fields['importiert von'] ? importiertVon : null}
            {pc.combining ? ursprungsEs : null}
          </div>
        </span>
      )
    }

    return (
      <div>
        <div className='Datensammlung beschreibungDatensammlung'>
          <span style={{marginRight: 3}}>{pc.fields.Beschreibung}</span>
          {mehr}
        </div>
      </div>
    )
  }
})
