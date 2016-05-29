'use strict'

import React from 'react'
import {
  FormGroup,
  InputGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap'
import { get } from 'lodash'
import SelectComparisonOperator from './selectComparisonOperator.js'
import InfoButtonAfter from './infoButtonAfter.js'
import PcDescription from './PcDescription.js'

const FieldsRCsPanel = ({
  relationFields,
  onChangeCoSelect,
  onChangeFilterField,
  rcs,
  exportOptions,
  cNameKey
}) => {
  const cNameObject = relationFields[cNameKey]
  const rc = rcs.find((r) => r.name === cNameKey)
  const fieldsSorted = (
    Object.keys(cNameObject)
      .sort((fNameKey) =>
        fNameKey.toLowerCase()
      )
  )
  const fields = fieldsSorted.map((fNameKey, index) => {
    const fieldKey = fNameKey.toLowerCase()
    const fNameObject = cNameObject[fNameKey]
    const value = get(exportOptions, `${cNameKey}.${fNameKey}.value`, null)
    const co = get(exportOptions, `${cNameKey}.${fNameKey}.co`, null)
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
                onChangeFilterField(cNameKey, fNameKey, 'rc', event)
              }
            />
            <InputGroup.Addon>
              {buttonAfter}
            </InputGroup.Addon>
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
              onChangeFilterField(cNameKey, fNameKey, 'rc', event)
            }
          >
            <option value={null}></option>
            <option value>ja</option>
            <option value={false}>nein</option>
          </FormControl>
          <InputGroup.Addon>{buttonAfter}</InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    )
  })
  return (
    <div>
      <PcDescription pc={rc} />
      <div className="felderspalte">
        {fields}
      </div>
    </div>
  )
}

FieldsRCsPanel.displayName = 'FieldsRCsPanel'

FieldsRCsPanel.propTypes = {
  cNameKey: React.PropTypes.string,
  relationFields: React.PropTypes.object,
  exportOptions: React.PropTypes.object,
  onChangeFilterField: React.PropTypes.func,
  onChangeCoSelect: React.PropTypes.func,
  rcs: React.PropTypes.array
}

export default FieldsRCsPanel
