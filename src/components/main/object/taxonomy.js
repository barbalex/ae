'use strict'

import React from 'react'
import PropertyCollection from './pc.js'

export default React.createClass({
  displayName: 'Taxonomy',

  propTypes: {
    object: React.PropTypes.object
  },

  render () {
    const { object } = this.props
    const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy.Standardtaxonomie)

    return (
      <div>
        <h4>Taxonomie:</h4>
        <PropertyCollection pcType='Taxonomie' object={object} propertyCollection={standardtaxonomie} />
      </div>
    )
  }
})
