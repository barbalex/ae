'use strict'

import React from 'react'
import { Button } from 'react-bootstrap'
import download from './download.js'

export default React.createClass({
  displayName: 'ButtonExport',

  propTypes: {
    exportObjects: React.PropTypes.array,
    format: React.PropTypes.string
  },

  onClick() {
    const { exportObjects, format } = this.props
    download(exportObjects, format)
  },

  render() {
    return (
      <Button
        bsStyle="primary"
        onClick={this.onClick}
      >
        herunterladen
      </Button>
    )
  }

})
