'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'AlertBuildingExportData',

  render () {
    const style = {
      marginTop: 6,
      marginBottom: 10
    }
    return (
      <Alert bsStyle='info' style={style}>
        <p>Die Exportdaten werden aufgebaut...</p>
      </Alert>
    )
  }
})
