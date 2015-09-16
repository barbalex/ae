'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellTaxonomienZusammenfassen',

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
      <Well className='well-sm'><b>Taxonomien zusammenfassen?</b> <a href='#' onClick={this.onClickToggle} className='showNextHidden'>{visible ? '...weniger' : '...mehr'}</a>
        <ul className='adb-hidden' style={{'display': visible ? 'block' : 'none'}}>
          <li>Mit dieser Option werden alle in den gewählten Gruppen vorkommenden Taxonomien unter dem Titel "Taxonomie(n)" zusammegefasst und darunter alle in diesen Taxonomien vorkommenden Felder aufgelistet</li>
          <li>Dabei werden die Daten gleich lautender Felder aus allen Taxonomien ins selbe Feld geschrieben</li>
          <li>Beispielsweise können Sie bei Lebensräumen im Feld "Taxonomie" nach "Delarze" filtern um alle Taxonomien von Delarze gleichzeitig zu exportieren</li>
          <li>Oder Sie können z.B. Arten aus Flora und Fauna gleichzeitig exportieren und dabei den vollständigen Artnamen ins selbe Feld schreiben</li>
        </ul>
      </Well>
    )
  }
})
