'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellZusammenfassendeEsImportieren',

  propTypes: {
    isZusEsVisible: React.PropTypes.bool
  },

  getInitialState () {
    return {
      isZusEsVisible: false
    }
  },

  onClickZusEs (event) {
    event.preventDefault()
    this.setState({
      isZusEsVisible: !this.state.isZusEsVisible
    })
  },

  render () {
    const { isZusEsVisible } = this.state

    return (
      <Well className='well-sm'><b>Für eine zusammenfassende Eigenschaftensammlung importieren Sie die Daten zwei mal </b><a href='#' onClick={this.onClickZusEs} className='showNextHidden'>{isZusEsVisible ? '...weniger' : '...mehr'}</a>
        <ul className='adb-hidden' style={{'display': isZusEsVisible ? 'block' : 'none'}}>
          <li>zuerst in die Ursprungs-Eigenschaftensammlung</li>
          <li>dann in die zusammenfassende. Bitte die Ursprungs-Eigenschaftensammlung angeben</li>
          <li>Mehr Infos <a href='//github.com/FNSKtZH/artendb#zusammenfassende_datensammlungen' target='_blank'>hier</a></li>
        </ul>
      </Well>
    )
  }
})
