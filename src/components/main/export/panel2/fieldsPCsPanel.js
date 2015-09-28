'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'
import _ from 'lodash'
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
    const pc = _.find(pcs, (pc) => pc.name === cNameKey)
    const fieldsSorted = _.sortBy(Object.keys(cNameObject), (fNameKey) => fNameKey.toLowerCase())
    const fields = fieldsSorted.map((fNameKey) => {
      const fieldKey = fNameKey.toLowerCase()
      const fNameObject = cNameObject[fNameKey]
      const value = _.get(exportOptions, `${cNameKey}.${fNameKey}.value`, null)
      const co = _.get(exportOptions, `${cNameKey}.${fNameKey}.co`, null)
      const selectComparisonOperator = <SelectComparisonOperator cNameKey={cNameKey} fNameKey={fNameKey} value={co} onChangeCoSelect={onChangeCoSelect} />
      const buttonAfter = <InfoButtonAfter fNameObject={fNameObject} />
      if (fNameObject.fType !== 'boolean') {
        return (
          <Input
            key={fieldKey}
            type={fNameObject.fType}
            label={fNameKey}
            bsSize='small'
            className={'controls'}
            value={value}
            onChange={this.onChange.bind(this, cNameKey, fNameKey)}
            buttonBefore={selectComparisonOperator}
            buttonAfter={buttonAfter} />
        )
      }
      return (
        <Input
          key={fieldKey}
          type='select'
          label={fNameKey}
          bsSize='small'
          className={'controls'}
          value={value}
          onChange={this.onChange.bind(this, cNameKey, fNameKey)}
          buttonAfter={buttonAfter} >
          <option value=''></option>
          <option value='true'>ja</option>
          <option value='false'>nein</option>
        </Input>
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
