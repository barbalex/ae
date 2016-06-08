import React from 'react'
import { ProgressBar } from 'react-bootstrap'

const ProgressbarImport = ({ importingProgress }) =>
  <ProgressBar
    bsStyle="success"
    now={importingProgress}
    label={`${importingProgress}% importiert`}
  />

ProgressbarImport.displayName = 'ProgressbarImport'

ProgressbarImport.propTypes = {
  importingProgress: React.PropTypes.number
}

export default ProgressbarImport
