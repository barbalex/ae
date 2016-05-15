'use strict'

import React from 'react'
import RelationCollection from './rc.js'

export default React.createClass({
  displayName: 'RelationCollections',

  propTypes: {
    objectRcs: React.PropTypes.array
  },

  render() {
    const { objectRcs } = this.props
    let rcsComponent = null
    if (objectRcs.length > 0) {
      rcsComponent = objectRcs.map((rc, index) => (
        <RelationCollection
          key={index}
          relationCollection={rc}
        />
      ))
    }

    return (
      <div>
        <h4>
          Beziehungen:
        </h4>
        {rcsComponent}
      </div>
    )
  }
})
