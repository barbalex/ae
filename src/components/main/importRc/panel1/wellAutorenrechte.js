'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellAutorenrechte',

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
      <Well bsSize='small'><b>Autorenrechte beachten </b> <a href='#' onClick={this.onClickToggle} className='showNextHidden'>{visible ? '...weniger' : '...mehr'}</a>
        <ul className='adb-hidden' style={{'display': visible ? 'block' : 'none'}}>
          <li>Die Autoren müssen mit der Veröffentlichung einverstanden sein</li>
          <li>Dafür verantwortlich ist, wer Daten importiert</li>
        </ul>
      </Well>
    )
  }
})
