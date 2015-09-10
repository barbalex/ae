'use strict'

import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

export default React.createClass({
  displayName: 'PcsQuerying',

  render () {
    const tooltip = <Tooltip id='pcsQueryingTooltip' bsStyle='info'>Bitte Geduld: Die App kann zeitweise einfrieren!</Tooltip>
    const pStyle = {
      color: 'red',
      fontWeight: 500,
      cursor: 'progress'
    }

    return (
      <OverlayTrigger placement='left' overlay={tooltip}>
        <p className='symbols text' style={pStyle}>Lade aktuelle Eigenschaftensammlungen...</p>
      </OverlayTrigger>
    )
  }
})
