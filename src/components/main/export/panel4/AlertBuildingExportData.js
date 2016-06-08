import React from 'react'
import { Alert } from 'react-bootstrap'

const style = {
  marginTop: 6,
  marginBottom: 0
}

const AlertBuildingExportData = () =>
  <Alert
    bsStyle="info"
    style={style}
  >
    <p>
      Die Exportdaten werden aufgebaut...
    </p>
  </Alert>

AlertBuildingExportData.displayName = 'AlertBuildingExportData'

export default AlertBuildingExportData
