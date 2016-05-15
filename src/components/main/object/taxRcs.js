'use strict'

import React from 'react'
import RelationCollection from './rc.js'

export default React.createClass({
  displayName: 'TaxonomicRelationCollections',

  propTypes: {
    taxRcs: React.PropTypes.array
  },

  render() {
    const { taxRcs } = this.props
    let taxRcComponent = null

    if (taxRcs.length > 0) {
      taxRcComponent = taxRcs.map((rc, index) => (
        <RelationCollection
          key={index}
          relationCollection={rc} />
      ))
    }

    return (
      <div>
        <h4>
          Taxonomische Beziehungen:
        </h4>
        {taxRcComponent}
      </div>
    )
  }
})
