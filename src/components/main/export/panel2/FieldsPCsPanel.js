'use strict'

import React from 'react'
import {
  FormGroup,
  InputGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap'
import { get } from 'lodash'
import { StyleSheet, css } from 'aphrodite'
import SelectComparisonOperator from './SelectComparisonOperator.js'
import InfoButtonAfter from './InfoButtonAfter.js'
import PcDescription from './PcDescription.js'

const styles = StyleSheet.create({
  fields: {
    columnWidth: 450,
    breakInside: 'avoid'
  },
  formGroup: {
    breakInside: 'avoid'
  },
  inputGroup: {
    width: 'calc(100% - 215px)'
  }
})

const FieldsPCsPanel = ({
  pcFields,
  onChangeCoSelect,
  onChangeFilterField,
  pcs,
  exportOptions,
  cNameKey
}) => {
  const cNameObject = pcFields[cNameKey]
  const pc = pcs.find((p) =>
    p.name === cNameKey
  )
  const fieldsSorted = (
    Object.keys(cNameObject).sort((fNameKey) =>
      fNameKey.toLowerCase()
    )
  )
  const fields = fieldsSorted.map((fNameKey, index) => {
    const fieldKey = fNameKey.toLowerCase()
    const fNameObject = cNameObject[fNameKey]
    const value = get(exportOptions, `${cNameKey}.${fNameKey}.value`, '')
    const co = get(exportOptions, `${cNameKey}.${fNameKey}.co`, '')
    const infoButtonAfterInstance = <InfoButtonAfter fNameObject={fNameObject} />

    if (fNameObject.fType !== 'boolean') {
      return (
        <FormGroup
          key={index}
          className={css(styles.formGroup)}
        >
          <ControlLabel>
            {fNameKey}
          </ControlLabel>
          <InputGroup className={css(styles.inputGroup)}>
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
              value={value}
              onChange={(event) =>
                onChangeFilterField(cNameKey, fNameKey, 'pc', event)
              }
            />
            <InputGroup.Addon>
              {infoButtonAfterInstance}
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
      )
    }
    return (
      <FormGroup
        key={index}
        className={css(styles.formGroup)}
      >
        <ControlLabel>
          {fNameKey}
        </ControlLabel>
        <InputGroup className={css(styles.inputGroup)}>
          <FormControl
            key={fieldKey}
            componentClass="select"
            value={value}
            onChange={(event) =>
              onChangeFilterField(cNameKey, fNameKey, 'pc', event)
            }
          >
            <option value={null}></option>
            <option value>ja</option>
            <option value={false}>nein</option>
          </FormControl>
          <InputGroup.Addon>
            {infoButtonAfterInstance}
          </InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    )
  })
  return (
    <div>
      <PcDescription pc={pc} />
      <div className={css(styles.fields)}>
        {fields}
      </div>
    </div>
  )
}

FieldsPCsPanel.displayName = 'FieldsPCsPanel'

FieldsPCsPanel.propTypes = {
  cNameKey: React.PropTypes.string,
  pcFields: React.PropTypes.object,
  exportOptions: React.PropTypes.object,
  onChangeFilterField: React.PropTypes.func,
  onChangeCoSelect: React.PropTypes.func,
  pcs: React.PropTypes.array
}

export default FieldsPCsPanel
