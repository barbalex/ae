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
    const loadingMessage = groupsLoadingObjects.map((groupLoadingObject) => {
      let { message, group, progressPercent } = groupLoadingObject
      // Macromycetes shall appear as Pilze
      message = message.replace('Macromycetes', 'Pilze')
      const groupName = group.toLowerCase()

      if (progressPercent || progressPercent === 0) return <ProgressBar bsStyle='success' key={groupName} now={progressPercent} label={message} />
      return <p key={groupName}>{message}</p>
    })

    return loadingMessage
  }
})
