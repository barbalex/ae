'use strict'

import React from 'react'
import { Tooltip, OverlayTrigger, Button, Glyphicon } from 'react-bootstrap'

const InfoButtonAfter = ({ fNameObject }) => {
  const id = `${fNameObject.cName}-${fNameObject.fName}-info`
  const tooltip = (
    <Tooltip id={id}>
      Gruppen: {fNameObject.groups.join(', ')}<br />
      Anzahl Objekte: {fNameObject.count}<br />
      Feldtyp: {fNameObject.fType}
    </Tooltip>
  )

  return (
    <OverlayTrigger
      placement="left"
      trigger={['click']}
      rootClose
      overlay={tooltip}
    >
      <Button
        bsSize="small"
      >
        <Glyphicon
          glyph="info-sign"
          style={{ fontSize: 17 }}
        />
      </Button>
    </OverlayTrigger>
  )
}

InfoButtonAfter.displayName = 'InfoButtonAfter'

InfoButtonAfter.propTypes = {
  fNameObject: React.PropTypes.object
}

export default InfoButtonAfter
