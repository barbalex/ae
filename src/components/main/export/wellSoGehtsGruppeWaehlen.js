'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellSoGehtsGruppeWaehlen',

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
      <Well className='well-sm'><b>So geht`s</b> <a href='#' onClick={this.onClickToggle} className='showNextHidden'>{visible ? '...weniger' : '...mehr'}</a>
        <ul className='adb-hidden' style={{'display': visible ? 'block' : 'none'}}>
          <li>Wählen Sie eine oder mehrere Gruppen...</li>
          <li>...dann werden die Eigenschaften der Gruppe(n) aufgebaut...</li>
          <li>...und Sie können filtern und Eigenschaften wählen</li>
          <li><a href='//youtu.be/J13wS88pYC8' target='_blank'>Screencast sehen</a></li>
        </ul>
      </Well>
    )
  }
})
