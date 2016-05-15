'use strict'

import React from 'react'
import { FormGroup, InputGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { get } from 'lodash'
import SelectComparisonOperator from './selectComparisonOperator.js'
import InfoButtonAfter from './infoButtonAfter.js'

export default React.createClass({
  displayName: 'FieldsTaxonomyPanel',

  propTypes: {
    cNameKey: React.PropTypes.string,
    taxonomyFields: React.PropTypes.object,
    exportOptions: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func
  },

  onChange (cName, fName, event) {
    const { onChangeFilterField } = this.props
    onChangeFilterField(cName, fName, 'taxonomy', event)
  },

  render () {
    const { taxonomyFields, exportOptions, onChangeCoSelect, cNameKey } = this.props
    const cNameObject = taxonomyFields[cNameKey]
    // we do not want the taxonomy field 'Hierarchie'
    delete cNameObject.Hierarchie
    const fieldsSorted = Object.keys(cNameObject).sort((fNameKey) => fNameKey.toLowerCase())
    const fields = fieldsSorted.map((fNameKey) => {
      const fieldKey = fNameKey.toLowerCase()
      const fNameObject = cNameObject[fNameKey]
      const value = get(exportOptions, `${cNameKey}.${fNameKey}.value`, null)
      const co = get(exportOptions, `${cNameKey}.${fNameKey}.co`, null)
      const selectComparisonOperator = <SelectComparisonOperator cNameKey={cNameKey} fNameKey={fNameKey} value={co} onChangeCoSelect={onChangeCoSelect} />
      const buttonAfter = <InfoButtonAfter fNameObject={fNameObject} />
      if (fNameObject.fType !== 'boolean') {
        return (
          <FormGroup>
            <ControlLabel>{fNameKey}</ControlLabel>
            <InputGroup>
              <InputGroup.Addon>{selectComparisonOperator}</InputGroup.Addon>
              <FormControl
                key={fieldKey}
                type={fNameObject.fType}
                bsSize='small'
                className='controls'
                value={value}
                onChange={this.onChange.bind(this, cNameKey, fNameKey)}
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
              bsSize='small'
              className='controls'
              value={value}
              onChange={this.onChange.bind(this, cNameKey, fNameKey)}
            >
              <option key='1' value={null}></option>
              <option key='2' value>ja</option>
              <option key='3' value={false}>nein</option>
            </FormControl>
            <InputGroup.Addon>{buttonAfter}</InputGroup.Addon>
          </InputGroup>
        </FormGroup>
      )
    })
    return (
      <div>
        <div className='felderspalte'>
          {fields}
        </div>
      </div>
    )
  }
})
