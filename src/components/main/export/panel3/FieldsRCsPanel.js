'use strict'

import React from 'react'
import { Checkbox } from 'react-bootstrap'
import { has, get } from 'lodash'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  fields: {
    columnWidth: 450,
    breakInside: 'avoid',
    marginBottom: -8
  },
  cb: {
    breakInside: 'avoid'
  },
  dbAlleWaehlen: {
    fontStyle: 'italic',
    marginBottom: 5
  }
})

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
        className={css(styles.cb)}
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
        className={css(styles.fields, styles.dbAlleWaehlen)}
      >
        <Checkbox
          checked={checked}
          className={css(styles.cb)}
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
      <div className={css(styles.fields)}>
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
