'use strict'

import React from 'react'
import RelationCollection from './rc.js'

const RelationCollections = ({ objectRcs }) => {
  let rcsComponent = null
  if (objectRcs.length > 0) {
    rcsComponent = objectRcs.map((rc, index) =>
      <RelationCollection
        key={index}
        relationCollection={rc}
      />
    )
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

RelationCollections.displayName = 'RelationCollections'

RelationCollections.propTypes = {
  objectRcs: React.PropTypes.array
}

export default RelationCollections
