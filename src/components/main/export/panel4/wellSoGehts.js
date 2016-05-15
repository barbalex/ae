'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellSoGehts',

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
      <Well bsSize='small'><b>So geht`s</b> <a href='#' onClick={this.onClickToggle} className='showNextHidden'>{visible ? '...weniger' : '...mehr'}</a>
        <ul className='adb-hidden' style={{'display': visible ? 'block' : 'none'}}>
          <li>Aus den Rohdaten werden die Exportdaten extrahiert...</li>
          <li><strong>...das dauert eine ganze Weile. Geduld bringt Daten!</strong></li>
          <li>Danach wird eine Vorschau der ersten 10 Datensätze angezeigt...</li>
          <li>...und es erscheinen Schaltflächen für den Download</li>
        </ul>
      </Well>
    )
  }
})
