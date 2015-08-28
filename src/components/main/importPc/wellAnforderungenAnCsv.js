'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellAnforderungenAnCsv',

  propTypes: {
    isAnforderungenAnCsvVisible: React.PropTypes.bool
  },

  getInitialState () {
    return {
      isAnforderungenAnCsvVisible: false
    }
  },

  onClickAnforderungenAnCsv (event) {
    event.preventDefault()
    this.setState({
      isAnforderungenAnCsvVisible: !this.state.isAnforderungenAnCsvVisible
    })
  },

  render () {
    const { isAnforderungenAnCsvVisible } = this.state

    return (
      <Well className='well-sm'><b>Zusätzliche Anforderungen an csv-Dateien</b> <a href='#' onClick={this.onClickAnforderungenAnCsv} className='showNextHidden'>{isAnforderungenAnCsvVisible ? '...weniger' : '...mehr'}</a>
        <ul className='adb-hidden' style={{'display': isAnforderungenAnCsvVisible ? 'block' : 'none'}}>
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
