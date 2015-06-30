/*
 * gets a relation and it's relation collection
 * builds the fields other than 'Beziehungspartner'
 */

'use strict'

import React from 'react'
import { State } from 'react-router'
import _ from 'lodash'
import Field from './field.js'

export default React.createClass({
  displayName: 'RelationFields',

  mixins: [State],

  propTypes: {
    relation: React.PropTypes.object,
    relationCollection: React.PropTypes.object
  },

  getInitialState () {
    return {
      relation: this.props.relation,
      relationCollection: this.props.relationCollection
    }
  },

  render () {
    const relation = this.state.relation
    const relationCollection = this.state.relationCollection

    const relationFields = _.map(relation, function (fieldValue, fieldName) {
      if (fieldName !== 'Beziehungspartner') {
        const rcName = relationCollection.Name.replace(/"/g, "'")
        return (
          <Field key={fieldName} fieldName={fieldName} fieldValue={fieldValue} pcType={'Beziehungssammlung'} pcName={rcName} />
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
