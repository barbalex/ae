import React from 'react'
import RelationCollection from './Rc.js'

const TaxonomicRelationCollections = ({ taxRcs }) => {
  let taxRcComponent = null

  if (taxRcs.length > 0) {
    taxRcComponent = taxRcs.map((rc, index) =>
      <RelationCollection
        key={index}
        relationCollection={rc}
      />
    )
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

TaxonomicRelationCollections.displayName = 'TaxonomicRelationCollections'

TaxonomicRelationCollections.propTypes = {
  taxRcs: React.PropTypes.array
}

export default TaxonomicRelationCollections
