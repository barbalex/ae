'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'

const InputAeId = ({ idsAeIdField, onChangeAeId }) => (
  <Input
    type="select"
    bsSize="small"
    label="zugehörige ID in ArtenDb"
    multiple
    className="form-control controls"
    style={{ height: `${101}px` }}
    value={[idsAeIdField]}
    onChange={(event) => onChangeAeId(event.target.value)}
  >
    <option value="GUID">GUID der ArtenDb</option>
    <option value="Fauna">ID der Info Fauna (NUESP)</option>
    <option value="Flora">ID der Info Flora (SISF-NR)</option>
    <option value="Moose">ID des Datenzentrums Moose Schweiz (TAXONNO)</option>
    <option value="Macromycetes">ID von Swissfungi (TaxonId)</option>
  </Input>
)

InputAeId.displayName = 'InputAeId'

InputAeId.propTypes = {
  idsAeIdField: React.PropTypes.string,
  onChangeAeId: React.PropTypes.func
}

export default InputAeId
