'use strict'

import React from 'react'
import { ProgressBar } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ProgressbarImport',

  propTypes: {
    importingProgress: React.PropTypes.number
  },

  render() {
    const { importingProgress } = this.props
    const label = importingProgress + '% importiert'
    return <ProgressBar bsStyle='success' now={importingProgress} label={label} />
  }
})
