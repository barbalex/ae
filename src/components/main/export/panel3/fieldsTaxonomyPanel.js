'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'
import { has, get } from 'lodash'

const FieldsTaxonomyPanel = ({
  taxonomyFields,
  exportOptions,
  cNameKey,
  collectionsWithAllChoosen,
  onChooseAllOfCollection,
  onChooseField
}) => {
  const cNameObject = taxonomyFields[cNameKey]
  // we do not want the taxonomy field 'Hierarchie'
  delete cNameObject.Hierarchie
  const fieldsSorted = Object.keys(cNameObject).sort((fNameKey) => fNameKey.toLowerCase())
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
        onChange={(event) => onChooseField(cNameKey, fNameKey, 'taxonomy', event)}
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
          onChange={(event) => onChooseAllOfCollection(cNameKey, 'taxonomy', event)}
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

FieldsTaxonomyPanel.displayName = 'FieldsTaxonomyPanel'

FieldsTaxonomyPanel.propTypes = {
  cNameKey: React.PropTypes.string,
  taxonomyFields: React.PropTypes.object,
  exportOptions: React.PropTypes.object,
  collectionsWithAllChoosen: React.PropTypes.array,
  onChooseAllOfCollection: React.PropTypes.func,
  onChooseField: React.PropTypes.func
}

export default FieldsTaxonomyPanel
