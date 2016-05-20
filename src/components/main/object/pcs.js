'use strict'

import React from 'react'
import PropertyCollection from './pc.js'

const PropertyCollections = ({ object }) => {
  const pcs = object.Eigenschaftensammlungen
  let pcComponent = null

  if (pcs && pcs.length > 0) {
    pcComponent = pcs.map((pc, index) => (
      <PropertyCollection
        key={index}
        pcType="Datensammlung"
        object={object}
        propertyCollection={pc}
      />
    ))
  }

  return (
    <div>
      <h4>
        Eigenschaften:
      </h4>
      {pcComponent}
    </div>
  )
}

PropertyCollections.displayName = 'PropertyCollections'

PropertyCollections.propTypes = {
  object: React.PropTypes.object
}

export default PropertyCollections
