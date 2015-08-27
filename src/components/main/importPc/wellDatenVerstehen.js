'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellDatenVerstehen',

  propTypes: {
    isDatenVerstehenVisible: React.PropTypes.bool
  },

  getInitialState () {
    return {
      isDatenVerstehenVisible: false
    }
  },

  onClickDatenVerstehen (event) {
    event.preventDefault()
    this.setState({
      isDatenVerstehenVisible: !this.state.isDatenVerstehenVisible
    })
  },

  render () {
    const { isDatenVerstehenVisible } = this.state

    return (
      <Well className='well-sm'><b>Erleichtern Sie den Benutzern, Ihre Daten zu verstehen </b> <a href='#' onClick={this.onClickDatenVerstehen} className='showNextHidden'>{isDatenVerstehenVisible ? '...weniger' : '...mehr'}</a>
        <ul className='adb-hidden' style={{'display': isDatenVerstehenVisible ? 'block' : 'none'}}>
          <li>Der Name sollte ungefähr dem ersten Teil eines Literaturzitats entsprechen. Beispiel: 'Blaue Liste (1998)'</li>
          <li>Wurden die Informationen spezifisch für einen bestimmten Kanton oder die ganze Schweiz erarbeitet? Wenn ja: Bitte das entsprechende Kürzel voranstellen. Beispiel: 'ZH Artwert (aktuell)'</li>
          <li>Die Beschreibung sollte im ersten Teil etwa einem klassischen Literaturzitat entsprechen. Beispiel: 'Gigon A. et al. (1998): Blaue Listen der erfolgreich erhaltenen oder geförderten Tier- und Pflanzenarten der Roten Listen. Methodik und Anwendung in der nördlichen Schweiz. Veröff. Geobot. Inst. ETH, Stiftung Rübel, Zürich 129: 1-137 + 180 pp. Appendicesn'</li>
          <li>In einem zweiten Teil sollte beschrieben werden, welche Informationen die Eigenschaftensammlung enthält. Beispiel: 'Eigenschaften von 207 Tierarten und 885 Pflanzenarten'</li>
          <li>Es kann hilfreich sein, den Zweck zu beschreiben, für den die Informationen zusammengestellt wurden</li>
          <li>Im Datenstand ist erkenntlich, wann die Eigenschaftensammlung zuletzt aktualisiert wurde</li>
          <li>Besonders hilfreich ist es, wenn die Originalpublikation verlinkt werden kann. Oder eine erläuternde Webseite</li>
        </ul>
      </Well>
    )
  }
})
