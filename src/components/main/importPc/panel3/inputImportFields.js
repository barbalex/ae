'use strict'

import React from 'react'
import { union } from 'lodash'
import { Input } from 'react-bootstrap'

const InputImportFields = ({ pcsToImport, idsImportIdField, onChangeImportId }) => {
  // get a list of all keys
  let keys = []
  pcsToImport.forEach((pc) => {
    keys = union(keys, Object.keys(pc))
  })

  const style = {
    height: `${(keys.length * 18) + 9}px`
  }

  const options = keys.map((key, index) => (
    <option
      key={index}
      value={key}
    >
      {key}
    </option>
  ))

  return (
    <Input
      type="select"
      label="Feld mit eindeutiger ID in den Importdaten"
      multiple
      className="form-control controls"
      style={style}
      bsSize="small"
      value={[idsImportIdField]}
      onChange={(event) => onChangeImportId(event.target.value)}
    >
      {options}
    </Input>
  )
}

InputImportFields.displayName = 'InputImportFields'

InputImportFields.propTypes = {
  idsImportIdField: React.PropTypes.string,
  pcsToImport: React.PropTypes.array,
  onChangeImportId: React.PropTypes.func
}

export default InputImportFields
