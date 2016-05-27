'use strict'

import React from 'react'
import RelationCollection from './rc.js'

const RcsOfSynonyms = ({ rcsOfSynonyms }) => {
  let rcsComponent = null

  if (rcsOfSynonyms.length > 0) {
    rcsComponent = rcsOfSynonyms.map((rc, index) =>
      <RelationCollection
        key={index}
        relationCollection={rc}
      />
    )
  }

  return (
    <div>
      <h4>
        Beziehungen von Synonymen:
      </h4>
      {rcsComponent}
    </div>
  )
}

RcsOfSynonyms.displayName = 'RcsOfSynonyms'

RcsOfSynonyms.propTypes = {
  rcsOfSynonyms: React.PropTypes.array
}

export default RcsOfSynonyms
