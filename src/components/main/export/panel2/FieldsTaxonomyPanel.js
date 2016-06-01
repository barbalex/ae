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
  const fieldsSorted = Object.keys(cNameObject)
    .sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) return -1
      return 1
    })
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
                onChangeFilterField(cNameKey, fNameKey, 'taxonomy', event)
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
    <div className={css(styles.fields)}>
      {fields}
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
