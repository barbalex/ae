'use strict'

import React from 'react'
import { ProgressBar } from 'react-bootstrap'

export default React.createClass({
  displayName: 'LoadingMessage',

  propTypes: {
    groupsLoadingObjects: React.PropTypes.array
  },

  render () {
    const { groupsLoadingObjects } = this.props

    // sort loading objects by name
    const loadingMessage = groupsLoadingObjects.map((groupLoadingObject, index) => {
      let { message, progressPercent } = groupLoadingObject
      // Macromycetes shall appear as Pilze
      message = message.replace('Macromycetes', 'Pilze')

      if (progressPercent || progressPercent === 0) return <ProgressBar bsStyle='success' key={index} now={progressPercent} label={message} />
      return <p key={index}>{message}</p>
    })

    return loadingMessage
  }
})
