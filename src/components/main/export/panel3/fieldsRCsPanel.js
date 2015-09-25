'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'
import _ from 'lodash'

export default React.createClass({
  displayName: 'FieldsRCsPanel',

  propTypes: {
    cNameKey: React.PropTypes.string,
    relationFields: React.PropTypes.object,
    exportOptions: React.PropTypes.object,
    collectionsWithAllChoosen: React.PropTypes.array,
    onChooseField: React.PropTypes.func,
    onChooseAllOfCollection: React.PropTypes.func
  },

  onChooseField (cName, fName, event) {
    const { onChooseField } = this.props
    onChooseField(cName, fName, event)
  },

  onChooseAllOfCollection (cName, event) {
    const { onChooseAllOfCollection } = this.props
    onChooseAllOfCollection('rc', cName, event)
  },

  render () {
    const { relationFields, exportOptions, cNameKey, collectionsWithAllChoosen } = this.props

    const cNameObject = relationFields[cNameKey]
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
          onChange={this.onChooseField.bind(this, cNameKey, fNameKey)} />
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
            onChange={this.onChooseAllOfCollection.bind(this, cNameKey)} />
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
