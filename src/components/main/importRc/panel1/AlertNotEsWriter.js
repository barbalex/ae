'use strict'

import React from 'react'
import { Alert, FormGroup, ControlLabel } from 'react-bootstrap'

const AlertNotEsWriter = () =>
  <FormGroup>
    <ControlLabel style={{ display: 'block' }} />
    <div style={{ width: '100%' }}>
      <Alert
        className="feld"
        bsStyle="danger"
      >
        Sie besitzen keine Schreibrechte.<br />
        Importieren kann nur, wer von einer beteiligten Organisation Schreibrechte erhält.<br />
        Wenn Sie Beziehungen importieren möchten, wenden Sie sich bitte an
        <a href="mailto:andreas.lienhard@bd.zh.ch"> die Fachstelle Naturschutz des Kantons Zürich</a>.
      </Alert>
    </div>
  </FormGroup>

AlertNotEsWriter.displayName = 'AlertNotEsWriter'

export default AlertNotEsWriter
