import React from 'react'
import { Alert } from 'react-bootstrap'

const style = {
  marginTop: 8,
  marginBottom: 0
}

const AlertChooseGroup = () =>
  <Alert
    bsStyle="info"
    style={style}
  >
    <p>
      Bitte wählen Sie mindestens eine Gruppe
    </p>
  </Alert>

AlertChooseGroup.displayName = 'AlertChooseGroup'

export default AlertChooseGroup
