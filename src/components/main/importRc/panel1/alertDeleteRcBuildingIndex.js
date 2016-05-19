'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

const style = {
  marginBottom: 5,
  marginTop: 11
}

const AlertDeleteRcBuildingIndex = () =>
  <Alert
    className="feld"
    bsStyle="info"
    style={style}
  >
    Hole Arten/Lebensräume, um die Eigenschaftensammlung daraus zu löschen.<br />
    Beim ersten Mal muss der Index aufgebaut werden. Das dauert einige Minuten...
  </Alert>

AlertDeleteRcBuildingIndex.displayName = 'AlertDeleteRcBuildingIndex'

export default AlertDeleteRcBuildingIndex
