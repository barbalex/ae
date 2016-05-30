'use strict'

import React from 'react'
import { ProgressBar } from 'react-bootstrap'

const ProgressbarDeleteRc = ({ progress }) =>
  <div className="feld">
    <ProgressBar
      bsStyle="success"
      now={progress}
      label={`${progress}% gelöscht`}
    />
  </div>

ProgressbarDeleteRc.displayName = 'ProgressbarDeleteRc'

ProgressbarDeleteRc.propTypes = {
  progress: React.PropTypes.number
}

export default ProgressbarDeleteRc
