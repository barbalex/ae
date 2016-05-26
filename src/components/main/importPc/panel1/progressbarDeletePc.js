'use strict'

import React from 'react'
import { ProgressBar } from 'react-bootstrap'

const ProgressbarDeletePc = ({ progress }) =>
  <div className="feld">
    <ProgressBar
      bsStyle="success"
      now={progress}
      label={`${progress}% gelöscht`}
    />
  </div>

ProgressbarDeletePc.displayName = 'ProgressbarDeletePc'

ProgressbarDeletePc.propTypes = {
  progress: React.PropTypes.number
}

export default ProgressbarDeletePc
