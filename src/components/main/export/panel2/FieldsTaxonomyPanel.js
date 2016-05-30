'use strict'

import React from 'react'
import {
  FormGroup,
  InputGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap'
import { get } from 'lodash'
import SelectComparisonOperator from './SelectComparisonOperator.js'
import InfoButtonAfter from './InfoButtonAfter.js'

const FieldsTaxonomyPanel = ({
  taxonomyFields,
  exportOptions,
  onChangeCoSelect,
  onChangeFilterField,
  cNameKey
}) => {
  const cNameObject = taxonomyFields[cNameKey]
  // we do not want the taxonomy field 'Hierarchie'
  delete cNameObject.Hierarchie
  const fieldsSorted = (
    Object.keys(cNameObject)
      .sort((fNameKey) =>
        fNameKey.toLowerCase()
      )
  )
  const fields = fieldsSorted.map((fNameKey, index) => {
    const fieldKey = fNameKey.toLowerCase()
    const fNameObject = cNameObject[fNameKey]
    const value = get(exportOptions, `${cNameKey}.${fNameKey}.value`, '')
    const co = get(exportOptions, `${cNameKey}.${fNameKey}.co`, '')
    const buttonAfter = <InfoButtonAfter fNameObject={fNameObject} />

    if (fNameObject.fType !== 'boolean') {
      return (
        <FormGroup
          key={index}
        >
          <ControlLabel>{fNameKey}</ControlLabel>
          <InputGroup>
            <InputGroup.Addon>
              <SelectComparisonOperator
                cNameKey={cNameKey}
                fNameKey={fNameKey}
                value={co}
                onChangeCoSelect={onChangeCoSelect}
              />
            </InputGroup.Addon>
            <FormControl
              key={fieldKey}
              type={fNameObject.fType}
              className="controls"
              value={value}
              onChange={(event) =>
                onChangeFilterField(cNameKey, fNameKey, 'taxonomy', event)
              }
            />
            <InputGroup.Addon>{buttonAfter}</InputGroup.Addon>
          </InputGroup>
        </FormGroup>
      )
    }
    return (
      <FormGroup>
        <ControlLabel>{fNameKey}</ControlLabel>
        <InputGroup>
          <FormControl
            key={fieldKey}
            componentClass="select"
            className="controls"
            value={value}
            onChange={(event) =>
              onChangeFilterField(cNameKey, fNameKey, 'taxonomy', event)
            }
          >
            <option value={null}></option>
            <option value>ja</option>
            <option value={false}>nein</option>
          </FormControl>
          <InputGroup.Addon>
            {buttonAfter}
          </InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    )
  })
  return (
    <div>
      <div className="felderspalte">
        {fields}
      </div>
    </div>
  )
}

FieldsTaxonomyPanel.displayName = 'FieldsTaxonomyPanel'

FieldsTaxonomyPanel.propTypes = {
  cNameKey: React.PropTypes.string,
  taxonomyFields: React.PropTypes.object,
  exportOptions: React.PropTypes.object,
  onChangeFilterField: React.PropTypes.func,
  onChangeCoSelect: React.PropTypes.func
}

export default FieldsTaxonomyPanel
