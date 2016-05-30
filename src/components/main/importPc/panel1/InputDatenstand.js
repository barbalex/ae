'use strict'

import React from 'react'
import { OverlayTrigger, Popover, FormGroup, FormControl } from 'react-bootstrap'

const popover = (
  <Popover
    id="InputDatenstandPopover"
    title="Wozu ein Datenstand?"
  >
    <p>
      Hier sieht der Nutzer, wann die Eigenschaftensammlung zuletzt aktualisiert wurde.
    </p>
  </Popover>
)

const InputDatenstand = ({
  datenstand,
  validDatenstand,
  onChangeDatenstand
}) => (
  <FormGroup
    validationState={validDatenstand ? null : 'error'}
  >
    <OverlayTrigger
      trigger={['click', 'focus']}
      rootClose
      placement="right"
      overlay={popover}
    >
      <label className="control-label withPopover">
        Datenstand
      </label>
    </OverlayTrigger>
    <FormControl
      componentClass="textarea"
      rows={1}
      value={datenstand}
      placeholder={validDatenstand ? '' : 'erforderlich'}
      onChange={(event) =>
        onChangeDatenstand(event.target.value)
      }
    />
  </FormGroup>
)

InputDatenstand.displayName = 'InputDatenstand'

InputDatenstand.propTypes = {
  datenstand: React.PropTypes.string,
  validDatenstand: React.PropTypes.bool,
  onChangeDatenstand: React.PropTypes.func
}

export default InputDatenstand
