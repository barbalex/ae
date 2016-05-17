'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellAnforderungenAnCsv',

  propTypes: {
    visible: React.PropTypes.bool
  },

  getInitialState() {
    return {
      visible: false
    }
  },

  onClickToggle(event) {
    event.preventDefault()
    this.setState({ visible: !this.state.visible })
  },

  render() {
    const { visible } = this.state

    return (
      <Well
        bsSize='small'>
        <b>Zusätzliche Anforderungen an csv-Dateien</b> <a href='#' onClick={this.onClickToggle} className='showNextHidden'>{visible ? '...weniger' : '...mehr'}</a>
        <ul
          className='adb-hidden'
          style={{'display': visible ? 'block' : 'none'}}>
          <li>Zeilen werden mit einem Zeilenumbruch getrennt</li>
            <li>Der Inhalt eines Felds bzw. einer Spalte sollte in der Regel in Anführungs- und Schlusszeichen eingefasst sein, z.B.: "Artwert"</li>
            <li>Ausnahmen: Zahlen und true/false-Werte brauchen keine Anführungs- und Schlusszeichen (es macht aber nichts, wenn sie sie haben)</li>
            <li>Felder sind mit Komma getrennt</li>
            <li>Die beschriebenen Anforderungen entsprechen der am häufigsten verwendeten Konfiguration des <a href='//de.wikipedia.org/wiki/CSV_(Dateiformat)'>"csv"-Formats</a></li>
        </ul>
      </Well>
    )
  }
})
