'use strict'

import React from 'react'
import PropertyCollection from './pc.js'

export default React.createClass({
  displayName: 'Taxonomy',

  propTypes: {
    object: React.PropTypes.object,
    onChangeObjectField: React.PropTypes.func,
    userRoles: React.PropTypes.array,
    editObjects: React.PropTypes.bool,
    toggleEditObjects: React.PropTypes.func
  },

  render () {
    const { object, onChangeObjectField, userRoles, editObjects, toggleEditObjects } = this.props
    const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy.Standardtaxonomie)

    return (
      <div>
        <h4>
          Taxonomie:
        </h4>
        <PropertyCollection
          pcType='Taxonomie'
          object={object}
          onChangeObjectField={onChangeObjectField}
          propertyCollection={standardtaxonomie}
          userRoles={userRoles}
          editObjects={editObjects}
          toggleEditObjects={toggleEditObjects} />
      </div>
    )
  }
})
