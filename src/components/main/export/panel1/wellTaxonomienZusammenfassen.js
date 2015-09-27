'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'
import ButtonTaxonomienZusammenfassen from './buttonTaxonomienZusammenfassen.js'

export default React.createClass({
  displayName: 'WellTaxonomienZusammenfassen',

  propTypes: {
    visible: React.PropTypes.bool,
    combineTaxonomies: React.PropTypes.bool,
    onChangeTaxonomienZusammenfassen: React.PropTypes.func
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
    const { combineTaxonomies, onChangeTaxonomienZusammenfassen } = this.props
    const pStyle = {
      marginLeft: 23,
      marginBottom: 0
    }
    const wellStyle = {
      marginTop: 5
    }

    return (
      <Well id='wellTaxonomienZusammenfassen' className='well-sm last-well' style={wellStyle}>
        <b>Felder der gewählten Taxonomien zusammenfassen?</b> <a href='#' onClick={this.onClickToggle} className='showNextHidden'>{visible ? '...weniger' : '...mehr'}</a>
        <div className='adb-hidden' style={{'display': visible ? 'block' : 'none'}}>
          <ul>
            <li>Wählen Sie diese Option, werden die Taxonomien der gewählten Gruppen unter dem Titel "Taxonomie(n)" zusammegefasst...<br/>
              ...und darunter alle in diesen Taxonomien vorkommenden Felder aufgelistet</li>
            <li>Dabei werden die Daten gleich lautender Felder ins selbe Feld geschrieben ("zusammegefasst"), und zwar:
              <ul>
                <li>schon beim filtern und Eigenschaften wählen</li>
                <li>...und natürlich beim exportieren</li>
              </ul>
            </li>
            <li>Nicht beeinflusst werden Felder aus Eigenschaften- oder Beziehungssammlungen</li>
          </ul>
          <p style={pStyle}><strong>Was nützt das?</strong> Sie können zum Beispiel:</p>
          <ul>
            <li>...bei Lebensräumen im Feld "Taxonomie" nach "Delarze" filtern um alle Taxonomien von Delarze gleichzeitig zu exportieren</li>
            <li>...Arten aus Flora und Fauna gleichzeitig exportieren und dabei den vollständigen Artnamen ins selbe Feld ("Artname vollständig") schreiben</li>
          </ul>
          <ButtonTaxonomienZusammenfassen
              combineTaxonomies={combineTaxonomies}
              onChangeTaxonomienZusammenfassen={onChangeTaxonomienZusammenfassen} />
        </div>
      </Well>
    )
  }
})
