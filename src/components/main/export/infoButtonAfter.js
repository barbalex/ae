'use strict'

import React from 'react'
import { Tooltip, OverlayTrigger, Button, Glyphicon } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InfoButtonAfter',

  propTypes: {
    fNameObject: React.PropTypes.object
  },

  render () {
    const { fNameObject } = this.props
    const id = `${fNameObject.cName}-${fNameObject.fName}-info`
    const tooltip = <Tooltip id={id}>Gruppen: {fNameObject.groups}<br/>Anzahl Objekte: {fNameObject.count}</Tooltip>
    return (
      <OverlayTrigger placement='left' trigger={['click']} rootClose overlay={tooltip}>
        <Button bsSize='small' style={{marginTop: -5}}><Glyphicon glyph='info-sign' style={{fontSize: 14}} /></Button>
      </OverlayTrigger>
    )
  }
})
