'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellTippsTricks',

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

  render() {
    const { visible } = this.state

    return (
      <Well className='well-sm last-well'><strong>Tipps und Tricks</strong> <a href='#' onClick={this.onClickToggle} className='showNextHidden'>{visible ? '...weniger' : '...mehr'}</a>
        <ul className='adb-hidden' style={{'display': visible ? 'block' : 'none'}}>
          <li>Sie können nach beliebig vielen Eigenschaften filtern. Jedes Kriterium reduziert die Anzahl "Treffer"<br/>
            Beispiel: Filtern Sie im Namen nach "Eisvogel" und in der Ordnung nach "Lepidoptera", erhalten Sie drei Schmetterlinge aber nicht den entsprechenden Vogel</li>
          <li>Sie möchten nach "Schmetterlinge" oder "Vögel" suchen? Exportieren Sie zuerst "Schmetterlinge", danach die "Vögel" und setzen die zwei Exporte zusammen</li>
          <li>Es kommt nicht auf Gross-/Kleinschreibung an<br/>
            Beispiel: Schreiben Sie "eisvogel", wird auch "Eisvogel" gefunden</li>
          <li>Sie können nach einem Teil des Feldinhalts filtern (wenn Sie keine Vergleichsoperatoren verwenden) <br/>
            Beispiel: Schreiben Sie "Vogel", wird auch "Eisvogel" gefunden</li>
          <li>Sie können die folgenden <strong>Vergleichsoperatoren</strong> im jeweils linken Feld verwenden:<br/>
            Beispiel 1: Schreiben Sie im Feld "Artwert" "&#62;5", werden Arten mit Artwert ab 6 gefunden<br/>
            Beispiel 2: Schreiben Sie "&#61;Vogel", wird "Vogel" gefunden, nicht aber "Eisvogel"</li>
          <li>Klicken Sie auf unterstrichene Namen um zu sehen, in welchen Gruppen und in wievielen Objekten die Eigenschaft vorkommt</li>
          <li>Was (noch) NICHT funktioniert: Wenn Sie nach zwei oder mehr Eigenschaften derselben Beziehungssammlung filtern und eines davon ist "Beziehungspartner", erhalten Sie zuviele Resultate.<br/>
            Filtern Sie hier also bloss nach einer Eigenschaft und im exportierten Resultat nach der zweiten</li>
        </ul>
      </Well>
    )
  }
})
