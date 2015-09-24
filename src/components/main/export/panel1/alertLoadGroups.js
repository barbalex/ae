'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'AlertLoadGroups',

  render () {
    return (
      <Alert bsStyle='info'>
        <p>Bitte Laden Sie mindestens eine Gruppe</p>
      </Alert>
    )
  }
})
