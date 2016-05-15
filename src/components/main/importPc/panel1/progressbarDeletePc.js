'use strict'

import React from 'react'
import { ProgressBar } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ProgressbarDeletePc',

  propTypes: {
    progress: React.PropTypes.number
  },

  render() {
    const { progress } = this.props
    const label = progress + '% gelöscht'
    return (
      <div
        className='feld'>
        <ProgressBar
          bsStyle='success'
          now={progress}
          label={label} />
      </div>
    )
  }
})
