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
    const pStyle = {
      marginLeft: 23,
      marginBottom: 0
    }

    return (
      <Well className='well-sm'>
        <b>Taxonomien zusammenfassen?</b> <a href='#' onClick={this.onClickToggle} className='showNextHidden'>{visible ? '...weniger' : '...mehr'}</a>
        <div className='adb-hidden' style={{'display': visible ? 'block' : 'none'}}>
          <ul>
            <li>Mit dieser Option werden alle in den gewählten Gruppen vorkommenden Taxonomien unter dem Titel "Taxonomie(n)" zusammegefasst und darunter alle in diesen Taxonomien vorkommenden Felder aufgelistet</li>
            <li>Dabei werden die Daten gleich lautender Felder aus allen Taxonomien ins selbe Feld geschrieben ("zusammegefasst"), und zwar:
              <ul>
                <li>schon beim filtern und Eigenschaften wählen</li>
                <li>...und natürlich beim exportieren</li>
              </ul>
            </li>
            <li>Nicht beeinflusst werden Felder aus Eigenschaften- oder Beziehungssammlungen</li>
          </ul>
          <p style={pStyle}>Beispiele:</p>
          <ul>
            <li>Sie können bei Lebensräumen im Feld "Taxonomie" nach "Delarze" filtern um alle Taxonomien von Delarze gleichzeitig zu exportieren</li>
            <li>Sie können Arten aus Flora und Fauna gleichzeitig exportieren und dabei den vollständigen Artnamen ins selbe Feld ("Artname vollständig") schreiben</li>
          </ul>
        </div>
      </Well>
    )
  }
})
