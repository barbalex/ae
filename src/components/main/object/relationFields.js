/*
 * gets a relation and it's relation collection
 * builds the fields other than 'Beziehungspartner'
 */

'use strict'

import React from 'react'
import { map } from 'lodash'
import Field from './Field.js'

const RelationFields = ({ relation, relationCollection }) => {
  const relationFields = map(relation, (fieldValue, fieldName) => {
    if (typeof fieldValue === 'string') {
      fieldValue = fieldValue.replace('&#39;', '\'')
    }
    if (fieldName !== 'Beziehungspartner') {
      const rcName = relationCollection.Name.replace(/"/g, "'")
      return (
        <Field
          key={fieldName}
          fieldName={fieldName}
          fieldValue={fieldValue}
          pcType="Beziehungssammlung"
          pcName={rcName}
        />
      )
    }
  })

  return (
    <div>
      {relationFields}
    </div>
  )
}

RelationFields.displayName = 'RelationFields'

RelationFields.propTypes = {
  relation: React.PropTypes.object,
  relationCollection: React.PropTypes.object
}

export default RelationFields
