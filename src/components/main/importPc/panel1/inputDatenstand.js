'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

const popover = (
  <Popover
    id="InputDatenstandPopover"
    title="Wozu ein Datenstand?"
  >
    <p>Hier sieht der Nutzer, wann die Eigenschaftensammlung zuletzt aktualisiert wurde.</p>
  </Popover>
)

const InputDatenstand = ({ datenstand, validDatenstand, onChangeDatenstand }) => (
  <div
    className={validDatenstand ? 'form-group' : 'form-group has-error'}
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
    <input
      type="textarea"
      className="form-control controls"
      rows={1}
      value={datenstand}
      onChange={(event) => onChangeDatenstand(event.target.value)}
    />
    {
      validDatenstand &&
      <div className="validateDiv feld">
        Ein Datenstand ist erforderlich
      </div>
    }
  </div>
)

InputDatenstand.displayName = 'InputDatenstand'

InputDatenstand.propTypes = {
  datenstand: React.PropTypes.string,
  validDatenstand: React.PropTypes.bool,
  onChangeDatenstand: React.PropTypes.func
}

export default InputDatenstand
