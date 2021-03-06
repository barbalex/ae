import React from 'react'
import { union } from 'lodash'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

const InputImportFields = ({
  pcsToImport,
  idsImportIdField,
  onChangeImportId
}) => {
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
    <FormGroup
      controlId="idsImportIdField"
    >
      <ControlLabel>
        Feld mit eindeutiger ID in den Importdaten
      </ControlLabel>
      <FormControl
        componentClass="select"
        multiple
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
  pcsToImport: React.PropTypes.array,
  onChangeImportId: React.PropTypes.func
}

export default InputImportFields
