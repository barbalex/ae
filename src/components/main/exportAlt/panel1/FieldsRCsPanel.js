import React from 'react'
import { Checkbox } from 'react-bootstrap'
import { get, has } from 'lodash'
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

const FieldsRCsPanel = ({
  relationFields,
  urlOptions,
  cNameKey,
  collectionsWithAllChoosen,
  onChooseField,
  onChooseAllOfCollection
}) => {
  const cNameObject = relationFields[cNameKey]
  const fieldsSorted = Object.keys(cNameObject)
    .sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) return -1
      return 1
    })
  const fields = fieldsSorted.map((fNameKey) => {
    const fieldKey = fNameKey.toLowerCase()
    let checked = false
    const path = `${cNameKey}.${fNameKey}.export`
    if (has(urlOptions, path)) checked = get(urlOptions, path)
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
        className={css(styles.fields, styles.divAlleWaehlen)}
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
      <div
        className={css(styles.fields)}
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
  urlOptions: React.PropTypes.object,
  collectionsWithAllChoosen: React.PropTypes.array,
  onChooseField: React.PropTypes.func,
  onChooseAllOfCollection: React.PropTypes.func
}

export default FieldsRCsPanel
