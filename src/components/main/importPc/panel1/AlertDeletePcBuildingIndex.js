import React from 'react'
import { Alert, FormGroup, ControlLabel } from 'react-bootstrap'

const AlertDeletePcBuildingIndex = () =>
  <FormGroup>
    <ControlLabel style={{ display: 'block' }} />
    <div style={{ width: '100%' }}>
      <Alert
        className="feld"
        bsStyle="info"
      >
        Hole Arten/Lebensräume, um die Eigenschaftensammlung daraus zu löschen.<br />
        Beim ersten Mal muss der Index aufgebaut werden. Das dauert einige Minuten...
      </Alert>
    </div>
  </FormGroup>

AlertDeletePcBuildingIndex.displayName = 'AlertDeletePcBuildingIndex'

export default AlertDeletePcBuildingIndex
