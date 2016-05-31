'use strict'

import React from 'react'
import { Alert, FormGroup, ControlLabel } from 'react-bootstrap'

const AlertEditingRcDisallowed = () =>
  <FormGroup>
    <ControlLabel style={{ display: 'block' }} />
    <div style={{ width: '100%' }}>
      <Alert
        className="feld"
        bsStyle="danger"
      >
        Sie Eigenschaftensammlungen nur verändern, wenn die Organisation
        mit Schreibrecht Ihnen Schreibrechte erteilt.<br />
        Ausnahme: zusammenfassende Eigenschaftensammlungen.
      </Alert>
    </div>
  </FormGroup>

AlertEditingRcDisallowed.displayName = 'AlertEditingRcDisallowed'

export default AlertEditingRcDisallowed
