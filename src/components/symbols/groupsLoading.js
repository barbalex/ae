'use strict'

import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

export default React.createClass({
  displayName: 'GroupsLoading',

  propTypes: {
    groupsLoadingObjects: React.PropTypes.array
  },

  render() {
    const { groupsLoadingObjects } = this.props
    const tooltip = <Tooltip id='groupsLoadingTooltip' bsStyle='info'>Bitte Geduld: Die App kann zeitweise einfrieren!</Tooltip>
    const text = groupsLoadingObjects.length > 1 ? 'Lade Gruppen...' : 'Lade Gruppe...'
    const pStyle = {
      color: 'red',
      fontWeight: 500,
      cursor: 'progress'
    }

    return (
      <OverlayTrigger placement='left' overlay={tooltip}>
        <p className='symbols text' style={pStyle}>{text}</p>
      </OverlayTrigger>
    )
  }
})
