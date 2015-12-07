'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellTechnAnforderungenAnDatei',

  propTypes: {
    visible: React.PropTypes.bool
  },

  getInitialState () {
    return {
      visible: false
    }
  },

  onClickToggle (event) {
    event.preventDefault()
    this.setState({ visible: !this.state.visible })
  },

  render () {
    const { visible } = this.state

    return (
      <Well bsSize='small'><b>Anforderungen an die Datei</b> <a href='#' onClick={this.onClickToggle} className='showNextHidden'>{visible ? '...weniger' : '...mehr'}</a>
        <ul className='adb-hidden' style={{'display': visible ? 'block' : 'none'}}>
          <li>Sie können Dateien vom Typ <b>.csv</b> (kommagetrennte Textdatei) oder <b>.xlsx</b> (Excel-Datei) importieren</li>
          <li>Die erste Zeile enthält die Feldnamen</li>
          <li>Die weiteren Zeilen enthalten je einen Datensatz, d.h. eine Beziehung für die betreffende Art oder den Lebensraum</li>
          <li>Alle Zeilen sollten dieselbe Anzahl Felder bzw. Spalten enthalten</li>
          <li>Achten Sie darauf, dass die Datei die Codierung "UTF 8" benutzt. Nur in diesem Format werden Umlaute und Sonderzeichen vollständig erkannt</li>
        </ul>
      </Well>
    )
  }
})
