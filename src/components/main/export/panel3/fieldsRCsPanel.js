'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'
import { has, get } from 'lodash'

const FieldsRCsPanel = ({
  relationFields,
  exportOptions,
  cNameKey,
  collectionsWithAllChoosen,
  onChooseField,
  onChooseAllOfCollection
}) => {
  const cNameObject = relationFields[cNameKey]
  const fieldsSorted = (
    Object.keys(cNameObject)
      .sort((fNameKey) => fNameKey.toLowerCase())
  )
  const fields = fieldsSorted.map((fNameKey) => {
    const fieldKey = fNameKey.toLowerCase()
    let checked = false
    const path = `${cNameKey}.${fNameKey}.export`
    if (has(exportOptions, path)) checked = get(exportOptions, path)
    return (
      <Input
        key={fieldKey}
        type="checkbox"
        label={fNameKey}
        checked={checked}
        onChange={(event) => onChooseField(cNameKey, fNameKey, 'rc', event)}
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
          onChange={(event) => onChooseAllOfCollection(cNameKey, 'rc', event)}
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

FieldsRCsPanel.displayName = 'FieldsRCsPanel'

FieldsRCsPanel.propTypes = {
  cNameKey: React.PropTypes.string,
  relationFields: React.PropTypes.object,
  exportOptions: React.PropTypes.object,
  collectionsWithAllChoosen: React.PropTypes.array,
  onChooseField: React.PropTypes.func,
  onChooseAllOfCollection: React.PropTypes.func
}

export default FieldsRCsPanel
