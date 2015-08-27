'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellAutorenrechte',

  propTypes: {
    isAutorenrechteVisible: React.PropTypes.bool
  },

  getInitialState () {
    return {
      isAutorenrechteVisible: false
    }
  },

  onClickAutorenrechte (event) {
    event.preventDefault()
    this.setState({
      isAutorenrechteVisible: !this.state.isAutorenrechteVisible
    })
  },

  render () {
    const { isAutorenrechteVisible } = this.state

    return (
      <Well className='well-sm last-well'><b>Autorenrechte beachten </b> <a href='#' onClick={this.onClickAutorenrechte} className='showNextHidden'>{isAutorenrechteVisible ? '...weniger' : '...mehr'}</a>
        <ul className='adb-hidden' style={{'display': isAutorenrechteVisible ? 'block' : 'none'}}>
          <li>Die Autoren müssen mit der Veröffentlichung einverstanden sein</li>
          <li>Dafür verantwortlich ist, wer Daten importiert</li>
        </ul>
      </Well>
    )
  }
})
