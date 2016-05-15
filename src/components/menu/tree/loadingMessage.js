'use strict'

import React from 'react'
import { ProgressBar } from 'react-bootstrap'

export default React.createClass({
  displayName: 'LoadingMessage',

  propTypes: {
    groupLoadingObject: React.PropTypes.object
  },

  render() {
    const { groupLoadingObject } = this.props

    let { message, progressPercent } = groupLoadingObject
    // Macromycetes shall appear as Pilze
    message = message.replace('Macromycetes', 'Pilze')

    if (progressPercent || progressPercent === 0) return <ProgressBar bsStyle="success" now={progressPercent} label={message} />
    return <p>{message}</p>
  }
})
