'use strict'

import React from 'react'
import PropertyCollection from './pc.js'

const PcsOfSynonyms = ({ pcsOfSynonyms, object }) => {
  let pcsComponent = null

  if (pcsOfSynonyms.length > 0) {
    pcsComponent = pcsOfSynonyms.map((pc, index) => (
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
        Eigenschaften von Synonymen:
      </h4>
      {pcsComponent}
    </div>
  )
}

PcsOfSynonyms.displayName = 'PcsOfSynonyms'

PcsOfSynonyms.propTypes = {
  object: React.PropTypes.object,
  pcsOfSynonyms: React.PropTypes.array
}

export default PcsOfSynonyms
