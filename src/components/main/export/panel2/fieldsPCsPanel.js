'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'
import _ from 'lodash'
import SelectComparisonOperator from './selectComparisonOperator.js'
import InfoButtonAfter from './infoButtonAfter.js'
import PcDescription from './pcDescription.js'

export default React.createClass({
  displayName: 'FieldsPCs',

  propTypes: {
    cNameKey: React.PropTypes.string,
    pcFields: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func,
    pcs: React.PropTypes.array
  },

  onBlur (cName, fName, event) {
    const { onChangeFilterField } = this.props
    onChangeFilterField(cName, fName, event)
  },

  render () {
    const { pcFields, onChangeCoSelect, pcs, cNameKey } = this.props
    const cNameObject = pcFields[cNameKey]
    const pc = _.find(pcs, (pc) => pc.name === cNameKey)
    const fieldsSorted = _.sortBy(Object.keys(cNameObject), (fNameKey) => fNameKey.toLowerCase())
    const fields = fieldsSorted.map((fNameKey) => {
      const fieldKey = fNameKey.toLowerCase()
      const fNameObject = cNameObject[fNameKey]
      const selectComparisonOperator = <SelectComparisonOperator cNameKey={cNameKey} fNameKey={fNameKey} onChangeCoSelect={onChangeCoSelect} />
      const buttonAfter = <InfoButtonAfter fNameObject={fNameObject} />
      if (fNameObject.fType !== 'boolean') {
        return (
          <Input
            key={fieldKey}
            type={fNameObject.fType}
            label={fNameKey}
            bsSize='small'
            className={'controls'}
            onBlur={this.onBlur.bind(this, cNameKey, fNameKey)}
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
          onBlur={this.onBlur.bind(this, cNameKey, fNameKey)}
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
