'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'AlertEditingPcDisallowed',

  render () {
    const style = {
      marginBottom: 5
    }
    return (
      <div
        className='form-group'>
        <Alert
          className='feld'
          bsStyle='danger'
          style={style}>
          Sie können nur Eigenschaftensammlungen verändern, die Sie selber importiert haben. Ausnahme: zusammenfassende.<br/>
          Bitte wählen Sie einen anderen Namen.
        </Alert>
      </div>
    )
  }
})
