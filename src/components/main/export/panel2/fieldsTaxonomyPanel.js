'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'
import _ from 'lodash'
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
          <option value={null}></option>
          <option value={true}>ja</option>
          <option value={false}>nein</option>
        </Input>
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
