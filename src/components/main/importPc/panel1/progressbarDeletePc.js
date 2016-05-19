'use strict'

import React from 'react'
import { ProgressBar } from 'react-bootstrap'

const ProgressbarDeletePc = ({ progress }) => {
  const label = `${progress}% gelöscht`
  return (
    <div className="feld">
      <ProgressBar
        bsStyle="success"
        now={progress}
        label={label}
      />
    </div>
  )
}

ProgressbarDeletePc.displayName = 'ProgressbarDeletePc'

ProgressbarDeletePc.propTypes = {
  progress: React.PropTypes.number
}

export default ProgressbarDeletePc
