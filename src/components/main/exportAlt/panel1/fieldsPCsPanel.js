'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'
import { has, get } from 'lodash'

export default React.createClass({
  displayName: 'FieldsPCsPanel',

  propTypes: {
    cNameKey: React.PropTypes.string,
    pcFields: React.PropTypes.object,
    urlOptions: React.PropTypes.object,
    collectionsWithAllChoosen: React.PropTypes.array,
    onChooseField: React.PropTypes.func,
    onChooseAllOfCollection: React.PropTypes.func
  },

  onChooseField(cName, fName, event) {
    const { onChooseField } = this.props
    onChooseField(cName, fName, 'pc', event)
  },

  onChooseAllOfCollection(cName, event) {
    const { onChooseAllOfCollection } = this.props
    onChooseAllOfCollection(cName, 'pc', event)
  },

  render() {
    const { pcFields, urlOptions, cNameKey, collectionsWithAllChoosen } = this.props

    const cNameObject = pcFields[cNameKey]
    const fieldsSorted = Object.keys(cNameObject).sort((fNameKey) => fNameKey.toLowerCase())
    const fields = fieldsSorted.map((fNameKey) => {
      const fieldKey = fNameKey.toLowerCase()
      let checked = false
      const path = `${cNameKey}.${fNameKey}.export`
      if (has(urlOptions, path)) checked = get(urlOptions, path)
      return (
        <Input
          key={fieldKey}
          type="checkbox"
          label={fNameKey}
          checked={checked}
          onChange={this.onChooseField.bind(this, cNameKey, fNameKey)}
        />
      )
    })
    let alleField = null
    if (fields.length > 1) {
      const checked = collectionsWithAllChoosen.includes(cNameKey)
      alleField = (
        <div
          className="felderspalte alleWaehlenCheckbox"
          style={{ marginBottom: 5 }}
        >
          <Input
            type="checkbox"
            label="alle"
            checked={checked}
            onChange={this.onChooseAllOfCollection.bind(this, cNameKey)}
          />
        </div>
      )
    }
    return (
      <div>
        {alleField}
        <div
          className="felderspalte"
          style={{ marginBottom: -8 }}
        >
          {fields}
        </div>
      </div>
    )
  }
})
