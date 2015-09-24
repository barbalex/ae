'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'
import _ from 'lodash'

export default React.createClass({
  displayName: 'FieldsTaxonomyPanel',

  propTypes: {
    cNameKey: React.PropTypes.string,
    taxonomyFields: React.PropTypes.object,
    exportOptions: React.PropTypes.object,
    collectionsWithAllChoosen: React.PropTypes.array,
    onChangeAllFields: React.PropTypes.func,
    onChangeField: React.PropTypes.func
  },

  onChangeField (cName, fName, event) {
    const { onChangeField } = this.props
    onChangeField(cName, fName, event)
  },

  onChangeAllFields (cName, event) {
    const { onChangeAllFields } = this.props
    onChangeAllFields(cName, event)
  },

  render () {
    const { taxonomyFields, exportOptions, cNameKey, collectionsWithAllChoosen } = this.props

    const cNameObject = taxonomyFields[cNameKey]
    // we do not want the taxonomy field 'Hierarchie'
    delete cNameObject.Hierarchie
    const fieldsSorted = _.sortBy(Object.keys(cNameObject), (fNameKey) => fNameKey.toLowerCase())
    const fields = fieldsSorted.map((fNameKey) => {
      const fieldKey = fNameKey.toLowerCase()
      let checked = false
      const path = `${cNameKey}.${fNameKey}.export`
      if (_.has(exportOptions, path)) checked = _.get(exportOptions, path)
      return (
        <Input
          key={fieldKey}
          type='checkbox'
          label={fNameKey}
          checked={checked}
          onChange={this.onChangeField.bind(this, cNameKey, fNameKey)} />
      )
    })
    let alleField = null
    if (fields.length > 1) {
      const checked = _.includes(collectionsWithAllChoosen, cNameKey)
      alleField = (
        <div className='felderspalte alleWaehlenCheckbox' style={{marginBottom: 5}}>
          <Input
            type='checkbox'
            label='alle'
            checked={checked}
            onChange={this.onChangeAllFields.bind(this, cNameKey)} />
        </div>
      )
    }
    return (
      <div>
        {alleField}
        <div className='felderspalte' style={{marginBottom: -8}}>
          {fields}
        </div>
      </div>
    )
  }
})
