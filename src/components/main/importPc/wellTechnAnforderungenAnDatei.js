'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellTechnAnforderungenAnDatei',

  propTypes: {
    isTechnAnforderungenAnDateiVisible: React.PropTypes.bool
  },

  getInitialState () {
    return {
      isTechnAnforderungenAnDateiVisible: false
    }
  },

  onClickTechnAnforderungenAnDatei (event) {
    event.preventDefault()
    this.setState({
      isTechnAnforderungenAnDateiVisible: !this.state.isTechnAnforderungenAnDateiVisible
    })
  },

  render () {
    const { isTechnAnforderungenAnDateiVisible } = this.state

    return (
      <Well className='well-sm'><b>Technische Anforderungen an die Datei</b> <a href='#' onClick={this.onClickTechnAnforderungenAnDatei} className='showNextHidden'>{isTechnAnforderungenAnDateiVisible ? '...weniger' : '...mehr'}</a>
        <ul className='adb-hidden' style={{'display': isTechnAnforderungenAnDateiVisible ? 'block' : 'none'}}>
          <li>Sie können Dateien vom Typ <b>.csv</b> (kommagetrennte Textdatei) oder <b>.xlsx</b> (Excel-Datei) importieren</li>
          <li>Die erste Zeile enthält die Feldnamen</li>
          <li>Die weiteren Zeilen enthalten je einen Datensatz, d.h. die Eigenschaften für die betreffende Art oder den Lebensraum</li>
          <li>Alle Zeilen sollten dieselbe Anzahl Felder bzw. Spalten enthalten</li>
          <li>Achten Sie darauf, dass die Datei die Codierung "UTF 8" benutzt. Nur in diesem Format werden Umlaute und Sonderzeichen vollständig erkannt</li>
        </ul>
      </Well>
    )
  }
})
