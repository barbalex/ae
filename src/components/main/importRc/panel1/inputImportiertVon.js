'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

const popover = () => (
  <Popover id="InputImportiertVonPopover">
    <p>Das ist immer die Email des angemeldeten Benutzers</p>
  </Popover>
)

const InputImportiertVon = ({ importiertVon }) =>
  <div className="form-group">
    <OverlayTrigger
      trigger={['click', 'focus']}
      rootClose
      placement="right"
      overlay={popover()}
    >
      <label className="control-label withPopover">
        importiert von
      </label>
    </OverlayTrigger>
    <input
      type="text"
      className="form-control controls"
      value={importiertVon}
      disabled
    />
  </div>

InputImportiertVon.displayName = 'InputImportiertVon'

InputImportiertVon.propTypes = {
  importiertVon: React.PropTypes.string
}

export default InputImportiertVon
