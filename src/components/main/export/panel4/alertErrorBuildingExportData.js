'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'AlertErrorBuildingExportData',

  propTypes: {
    errorBuildingExportData: React.PropTypes.string
  },

  render () {
    const { errorBuildingExportData } = this.props
    const style = {
      marginTop: 6,
      marginBottom: 0
    }
    return (
      <Alert bsStyle='danger' style={style}>
        <p>Fehler beim Aufbauen der Exportdaten: {errorBuildingExportData}</p>
      </Alert>
    )
  }
})
