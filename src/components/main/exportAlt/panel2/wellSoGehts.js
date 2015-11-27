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

  render () {
    const { visible } = this.state

    return (
      <Well bsSize='small'><b>So geht`s</b> <a href='#' onClick={this.onClickToggle} className='showNextHidden'>{visible ? '...weniger' : '...mehr'}</a>
        <ul className='adb-hidden' style={{'display': visible ? 'block' : 'none'}}>
          <li>Die URL wurde generiert und zum Kopieren markiert</li>
          <li><strong>Kopieren Sie die URL, um sie im Artenlistentool einzufügen</strong></li>
          <li>Eine Vorschau der ersten 10 Datensätze wird angezeigt</li>
          <li>Zusätzlich zu den von Ihnen gewählten Feldern, werden weitere geliefert, die vom Artenlistentool benötigt werden</li>
        </ul>
      </Well>
    )
  }
})
