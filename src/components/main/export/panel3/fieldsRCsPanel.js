'use strict'

import React from 'react'
import { Checkbox } from 'react-bootstrap'
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
      <Checkbox
        key={fieldKey}
        checked={checked}
        onChange={(event) =>
          onChooseField(cNameKey, fNameKey, 'rc', event)
        }
      >
        {fNameKey}
      </Checkbox>
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
        <Checkbox
          checked={checked}
          onChange={(event) =>
            onChooseAllOfCollection(cNameKey, 'rc', event)
          }
        >
          alle
        </Checkbox>
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
