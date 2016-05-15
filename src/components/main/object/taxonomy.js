'use strict'

import React from 'react'
import PropertyCollection from './pc.js'

export default React.createClass({
  displayName: 'Taxonomy',

  propTypes: {
    object: React.PropTypes.object,
    onSaveObjectField: React.PropTypes.func,
    userRoles: React.PropTypes.array,
    editObjects: React.PropTypes.bool,
    toggleEditObjects: React.PropTypes.func,
    addNewObject: React.PropTypes.func,
    removeObject: React.PropTypes.func
  },

  render() {
    const { object, onSaveObjectField, userRoles, editObjects, toggleEditObjects, addNewObject, removeObject } = this.props
    const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy.Standardtaxonomie)

    return (
      <div>
        <h4>
          Taxonomie:
        </h4>
        <PropertyCollection
          pcType='Taxonomie'
          object={object}
          onSaveObjectField={onSaveObjectField}
          propertyCollection={standardtaxonomie}
          userRoles={userRoles}
          editObjects={editObjects}
          toggleEditObjects={toggleEditObjects}
          addNewObject={addNewObject}$
          removeObject={removeObject} />
      </div>
    )
  }
})
