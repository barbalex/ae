'use strict'

import React from 'react'
import { FormGroup, InputGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { get } from 'lodash'
import SelectComparisonOperator from './selectComparisonOperator.js'
import InfoButtonAfter from './infoButtonAfter.js'
import PcDescription from './pcDescription.js'

export default React.createClass({
  displayName: 'FieldsPCsPanel',

  propTypes: {
    cNameKey: React.PropTypes.string,
    pcFields: React.PropTypes.object,
    exportOptions: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func,
    pcs: React.PropTypes.array
  },

  onChange (cName, fName, event) {
    const { onChangeFilterField } = this.props
    onChangeFilterField(cName, fName, 'pc', event)
  },

  render () {
    const { pcFields, onChangeCoSelect, pcs, exportOptions, cNameKey } = this.props
    const cNameObject = pcFields[cNameKey]
    const pc = pcs.find((pc) => pc.name === cNameKey)
    const fieldsSorted = Object.keys(cNameObject).sort((fNameKey) => fNameKey.toLowerCase())
    const fields = fieldsSorted.map((fNameKey, index) => {
      const fieldKey = fNameKey.toLowerCase()
      const fNameObject = cNameObject[fNameKey]
      const value = get(exportOptions, `${cNameKey}.${fNameKey}.value`, null)
      const co = get(exportOptions, `${cNameKey}.${fNameKey}.co`, null)
      const buttonAfter = <InfoButtonAfter fNameObject={fNameObject} />
      if (fNameObject.fType !== 'boolean') {
        return (
          <FormGroup key={index}>
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
        <PcDescription pc={pc} />
        <div className='felderspalte'>
          {fields}
        </div>
      </div>
    )
  }
})
