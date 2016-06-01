'use strict'

import React from 'react'
import { Checkbox } from 'react-bootstrap'
import { has, get } from 'lodash'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  fields: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  cb: {
    width: 450
  },
  divAlleWaehlen: {
    fontStyle: 'italic',
    marginBottom: 5
  }
})

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
  const fieldsSorted = Object.keys(cNameObject)
    .sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) return -1
      return 1
    })
  const fields = fieldsSorted.map((fNameKey) => {
    const fieldKey = fNameKey.toLowerCase()
    let checked = false
    const path = `${cNameKey}.${fNameKey}.export`
    if (has(exportOptions, path)) {
      checked = get(exportOptions, path)
    }
    return (
      <Checkbox
        key={fieldKey}
        checked={checked}
        className={css(styles.cb)}
        onChange={(event) =>
          onChooseField(cNameKey, fNameKey, 'taxonomy', event)
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
        className={css(styles.fields, styles.divAlleWaehlen)}
      >
        <Checkbox
          checked={checked}
          className={css(styles.cb)}
          onChange={(event) =>
            onChooseAllOfCollection(cNameKey, 'taxonomy', event)
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
