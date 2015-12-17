'use strict'

import React from 'react'
import PropertyCollection from './pc.js'

export default React.createClass({
  displayName: 'Taxonomy',

  propTypes: {
    object: React.PropTypes.object,
    userRoles: React.PropTypes.array
  },

  render () {
    const { object, userRoles } = this.props
    const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy.Standardtaxonomie)

    return (
      <div>
        <h4>
          Taxonomie:
        </h4>
        <PropertyCollection
          pcType='Taxonomie'
          object={object}
          propertyCollection={standardtaxonomie}
          userRoles={userRoles} />
      </div>
    )
  }
})
