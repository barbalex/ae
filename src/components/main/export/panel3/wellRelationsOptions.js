'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellRelationsOptions',

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
    const wellStyle = {
      margin: 10 + 'px !important'
    }

    return (
      <Well className='well-sm' style={wellStyle}>
        <b>Option wählen</b> <a href='#' onClick={this.onClickToggle} className='showNextHidden'>{visible ? '...weniger' : '...mehr'}</a>
        <ol className='adb-hidden' style={{'display': visible ? 'block' : 'none'}}>
          <li>Pro Beziehung eine Zeile (Standardeinstellung):
            <ul>
              <li>Wie immer wird für jede gewählte Eigenschaft der Beziehungssammlung ein Feld erzeugt</li>
              <li>ABER: Für jede Art oder Lebensraum wird pro Beziehung eine neue Zeile erzeugt</li>
              <li>Wählen Sie also z.B. Lebensraum-Beziehungen einer Art, wird für jeden Lebensraum eine neue Zeile erzeugt</li>
              <li>Das vereinfacht eine anschliessende Auswertung nach den Beziehungen,<br/>
                erschwert aber die Auswertung nach anderen Eigenschaften</li>
              <li>Sie können aus maximal einer Beziehungssammlung Felder wählen<br/>
                (aber wie gewohnt mit beliebig vielen Feldern aus Taxonomie(n) und Eigenschaftensammlungen ergänzen)</li>
            </ul>
          </li>
          <li>Pro Art/Lebensraum eine Zeile. Alle Beziehungen kommagetrennt in einem Feld:
            <ul>
              <li>Wie immer wird für jede gewählte Eigenschaft der Beziehungssammlung ein Feld erzeugt...</li>
              <li>...und pro Art bzw. Lebensraum eine Zeile erzeugt</li>
              <li>ABER: Von allen Beziehungen wird der Inhalt eines Feldes kommagetrennt in ein Feld geschrieben</li>
              <li>Wählen Sie also z.B. Lebensraum-Beziehungen einer Art, wird jeder Lebensraum kommagetrennt in einer einzigen Zelle aufgelistet</li>
              <li>Das vereinfacht eine anschliessende Auswertung nach den Eigenschaften der Art,<br/>
                erschwert aber die Auswertung nach den Beziehungen</li>
              <li>Sie können Felder aus beliebig vielen Beziehungssammlungen gleichzeitig exportieren</li>
            </ul>
          </li>
        </ol>
      </Well>
    )
  }
})
