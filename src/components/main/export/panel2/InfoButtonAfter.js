'use strict'

import React from 'react'
import {
  Tooltip,
  OverlayTrigger,
  Button,
  Glyphicon
} from 'react-bootstrap'

const InfoButtonAfter = ({ fNameObject }) =>
  <OverlayTrigger
    placement="left"
    trigger={['click']}
    rootClose
    overlay={
      <Tooltip id={`${fNameObject.cName}-${fNameObject.fName}-info`}>
        Gruppen: {fNameObject.groups.join(', ')}<br />
        Anzahl Objekte: {fNameObject.count}<br />
        Feldtyp: {fNameObject.fType}
      </Tooltip>
    }
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

InfoButtonAfter.displayName = 'InfoButtonAfter'

InfoButtonAfter.propTypes = {
  fNameObject: React.PropTypes.object
}

export default InfoButtonAfter
