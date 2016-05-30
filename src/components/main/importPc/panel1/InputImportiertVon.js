'use strict'

import React from 'react'
import { OverlayTrigger, Popover, FormGroup, FormControl } from 'react-bootstrap'

const popover = (
  <Popover
    id="InputImportiertVonPopover"
  >
    <p>
      Das ist immer die Email des angemeldeten Benutzers
    </p>
  </Popover>
)

const InputImportiertVon = ({ importiertVon }) => (
  <FormGroup>
    <OverlayTrigger
      trigger={['click', 'focus']}
      rootClose
      placement="right"
      overlay={popover}
    >
      <label className="control-label withPopover">
        importiert von
      </label>
    </OverlayTrigger>
    <FormControl
      type="text"
      value={importiertVon}
      disabled
    />
  </FormGroup>
)

InputImportiertVon.displayName = 'InputImportiertVon'

InputImportiertVon.propTypes = {
  importiertVon: React.PropTypes.string
}

export default InputImportiertVon
