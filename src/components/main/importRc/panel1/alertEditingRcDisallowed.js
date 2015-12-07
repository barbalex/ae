'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'AlertEditingRcDisallowed',

  render () {
    const style = {
      marginBottom: 5
    }
    return (
      <Alert className='feld' bsStyle='danger' style={style}>
        Sie können nur Eigenschaftensammlungen verändern, die Sie selber importiert haben. Ausnahme: zusammenfassende.<br/>
        Bitte wählen Sie einen anderen Namen.
      </Alert>
    )
  }
})
