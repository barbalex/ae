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
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func
  },

  onBlur (cName, fName, event) {
    const { onChangeFilterField } = this.props
    onChangeFilterField(cName, fName, 'taxonomy', event)
  },

  render () {
    const { taxonomyFields, onChangeCoSelect, cNameKey } = this.props
    const cNameObject = taxonomyFields[cNameKey]
    // we do not want the taxonomy field 'Hierarchie'
    delete cNameObject.Hierarchie
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
        <div className='felderspalte'>
          {fields}
        </div>
      </div>
    )
  }
})
