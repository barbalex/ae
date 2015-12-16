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
    const tooltip = (
      <Tooltip id={id}>
        Gruppen: {fNameObject.groups.join(', ')}<br/>Anzahl Objekte: {fNameObject.count}<br/>Feldtyp: {fNameObject.fType}
      </Tooltip>
    )
    const buttonMartinTop = fNameObject.fType === 'boolean' ? 0 : -5
    const buttonStyle = {
      marginTop: buttonMartinTop
    }
    return (
      <OverlayTrigger
        placement='left'
        trigger={['click']}
        rootClose
        overlay={tooltip}>
        <Button
          bsSize='small'
          style={buttonStyle}>
          <Glyphicon
            glyph='info-sign'
            style={{fontSize: 14}} />
        </Button>
      </OverlayTrigger>
    )
  }
})
