'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

const style = {
  marginTop: 6,
  marginBottom: 0
}

const AlertErrorBuildingExportData = ({ errorBuildingExportData }) =>
  <Alert
    bsStyle="danger"
    style={style}
  >
    <p>
      Fehler beim Aufbauen der Exportdaten: {JSON.stringify(errorBuildingExportData)}
    </p>
  </Alert>

AlertErrorBuildingExportData.displayName = 'AlertErrorBuildingExportData'

AlertErrorBuildingExportData.propTypes = {
  errorBuildingExportData: React.PropTypes.object
}

export default AlertErrorBuildingExportData
