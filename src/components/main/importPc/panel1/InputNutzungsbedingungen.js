'use strict'

import React from 'react'
import { OverlayTrigger, Popover, FormGroup, FormControl } from 'react-bootstrap'

const popover = (
  <Popover
    id="InputNutzungsbedingungenPopover"
    title="Wozu Nutzunsbedingungen?"
  >
    <p>
      Der Nutzer soll wissen, was er mit den Daten machen darf.
    </p>
    <p>
      <strong>Beispiele:</strong>
    </p>
    <p>
      Wenn <strong>fremde Daten</strong> mit Einverständnis des Autors importiert werden:<br />
      "Importiert mit Einverständnis des Autors.
      Eine allfällige Weiterverbreitung ist nur mit dessen Zustimmung möglich."
    </p>
    <p>
      Wenn <strong>eigene Daten</strong> importiert werden:<br />
      "Open Data: Die veröffentlichten Daten dürfen mit Hinweis auf die Quelle vervielfältigt,
      verbreitet und weiter zugänglich gemacht, angereichert und bearbeitet sowie kommerziell genutzt werden.
      Für die Richtigkeit, Genauigkeit, Zuverlässigkeit und Vollständigkeit der bezogenen,
      ebenso wie der daraus erzeugten Daten und anderer mit Hilfe dieser Daten hergestellten Produkte
      wird indessen keine Haftung übernommen."
    </p>
  </Popover>
)

const InputNutzungsbedingungen = ({
  nutzungsbedingungen,
  validNutzungsbedingungen,
  onChangeNutzungsbedingungen
}) =>
  <FormGroup
    controlId="nutzungsbedingungenInput"
    validationState={validNutzungsbedingungen ? null : 'error'}
  >
    <OverlayTrigger
      trigger={['click', 'focus']}
      rootClose
      placement="right"
      overlay={popover}
    >
      <label className="control-label withPopover">
        Nutzungsbedingungen
      </label>
    </OverlayTrigger>
    <FormControl
      componentClass="textarea"
      rows={1}
      value={nutzungsbedingungen}
      placeholder={validNutzungsbedingungen ? '' : 'erforderlich'}
      onChange={(event) =>
        onChangeNutzungsbedingungen(event.target.value)
      }
    />
  </FormGroup>

InputNutzungsbedingungen.displayName = 'InputNutzungsbedingungen'

InputNutzungsbedingungen.propTypes = {
  nutzungsbedingungen: React.PropTypes.string,
  validNutzungsbedingungen: React.PropTypes.bool,
  onChangeNutzungsbedingungen: React.PropTypes.func
}

export default InputNutzungsbedingungen
