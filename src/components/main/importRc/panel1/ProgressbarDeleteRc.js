'use strict'

import React from 'react'
import { ProgressBar, FormGroup, ControlLabel } from 'react-bootstrap'

const ProgressbarDeleteRc = ({ progress }) =>
  <FormGroup>
    <ControlLabel style={{ display: 'block' }} />
    <div style={{ width: '100%' }}>
      <ProgressBar
        bsStyle="success"
        now={progress}
        label={`${progress}% gelöscht`}
      />
    </div>
  </FormGroup>

ProgressbarDeleteRc.displayName = 'ProgressbarDeleteRc'

ProgressbarDeleteRc.propTypes = {
  progress: React.PropTypes.number
}

export default ProgressbarDeleteRc
