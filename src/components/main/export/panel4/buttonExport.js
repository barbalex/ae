'use strict'

import React from 'react'
import { Button } from 'react-bootstrap'
import download from './download.js'

const ButtonExport = ({ exportObjects, format }) =>
  <Button
    bsStyle="primary"
    onClick={() => download(exportObjects, format)}
  >
    herunterladen
  </Button>

ButtonExport.displayName = 'ButtonExport'

ButtonExport.propTypes = {
  exportObjects: React.PropTypes.array,
  format: React.PropTypes.string
}

export default ButtonExport
