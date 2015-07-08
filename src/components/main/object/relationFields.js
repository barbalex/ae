/*
 * gets a relation and it's relation collection
 * builds the fields other than 'Beziehungspartner'
 */

'use strict'

import React from 'react'
import _ from 'lodash'
import Field from './field.js'

export default React.createClass({
  displayName: 'RelationFields',

  propTypes: {
    relation: React.PropTypes.object,
    relationCollection: React.PropTypes.object
  },

  render () {
    const { relation, relationCollection } = this.props

    const relationFields = _.map(relation, function (fieldValue, fieldName) {
      if (fieldName !== 'Beziehungspartner') {
        const rcName = relationCollection.Name.replace(/"/g, "'")
        return (
          <Field key={fieldName} fieldName={fieldName} fieldValue={fieldValue.replace('&#39;', '\'')} pcType={'Beziehungssammlung'} pcName={rcName} />
        )
      }
    })

    return (
      <div>
        {relationFields}
      </div>
    )
  }
})
