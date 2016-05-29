'use strict'

import React from 'react'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

const InputAeId = ({ idsAeIdField, onChangeAeId }) =>
  <FormGroup
    controlId="inputAeId"
  >
    <ControlLabel>
      zugehörige ID in ArtenDb
    </ControlLabel>
    <FormControl
      componentClass="select"
      multiple
      className="form-control controls"
      style={{ height: `${101}px` }}
      value={[idsAeIdField]}
      onChange={(event) =>
        onChangeAeId(event.target.value)
      }
    >
      <option value="GUID">
        GUID der ArtenDb
      </option>
      <option value="Fauna">
        ID der Info Fauna (NUESP)
      </option>
      <option value="Flora">
        ID der Info Flora (SISF-NR)
      </option>
      <option value="Moose">
        ID des Datenzentrums Moose Schweiz (TAXONNO)
      </option>
      <option value="Macromycetes">
        ID von Swissfungi (TaxonId)
      </option>
    </FormControl>
  </FormGroup>

InputAeId.displayName = 'InputAeId'

InputAeId.propTypes = {
  idsAeIdField: React.PropTypes.string,
  onChangeAeId: React.PropTypes.func
}

export default InputAeId
