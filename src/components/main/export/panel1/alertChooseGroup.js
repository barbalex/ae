'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'AlertChooseGroup',

  render() {
    const style = {
      marginTop: 8,
      marginBottom: 0
    }
    return (
      <Alert bsStyle='info' style={style}>
        <p>Bitte wählen Sie mindestens eine Gruppe</p>
      </Alert>
    )
  }
})
