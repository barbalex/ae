'use strict'

import React from 'react'
import { union, without } from 'lodash'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

const InputImportFields = ({ rcsToImport, idsImportIdField, onChangeImportId }) => {
  // get a list of all keys
  let keys = []
  rcsToImport.forEach((pc) => {
    keys = union(keys, Object.keys(pc))
  })
  // remove field '_id'
  keys = without(keys, '_id')

  const style = { height: `${((keys.length * 18) + 9)}px` }
  const options = keys.map((key, index) => (
    <option
      key={index}
      value={key}
    >
      {key}
    </option>
  ))

  return (
    <FormGroup
      controlId="idsImportIdField"
      bsSize="small"
    >
      <ControlLabel>
        Feld mit eindeutiger ID in den Importdaten
      </ControlLabel>
      <FormControl
        componentClass="select"
        multiple
        className="form-control controls"
        style={style}
        value={[idsImportIdField]}
        onChange={(event) =>
          onChangeImportId(event.target.value)
        }
      >
        {options}
      </FormControl>
    </FormGroup>
  )
}

InputImportFields.displayName = 'InputImportFields'

InputImportFields.propTypes = {
  idsImportIdField: React.PropTypes.string,
  rcsToImport: React.PropTypes.array,
  onChangeImportId: React.PropTypes.func
}

export default InputImportFields
