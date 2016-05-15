'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'AlertEditingRcDisallowed',

  render() {
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
          Sie Eigenschaftensammlungen nur verändern, wenn die Organisation mit Schreibrecht Ihnen Schreibrechte erteilt.<br/>
          Ausnahme: zusammenfassende Eigenschaftensammlungen.
        </Alert>
      </div>
    )
  }
})
