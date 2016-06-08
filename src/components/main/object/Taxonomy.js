import React from 'react'
import PropertyCollection from './Pc.js'

const Taxonomy = ({
  object,
}) => {
  const standardtaxonomie = object.Taxonomien.find((taxonomy) =>
    taxonomy.Standardtaxonomie
  )

  return (
    <div>
      <h4>
        Taxonomie:
      </h4>
      <PropertyCollection
        pcType="Taxonomie"
        propertyCollection={standardtaxonomie}
      />
    </div>
  )
}

Taxonomy.displayName = 'Taxonomy'

Taxonomy.propTypes = {
  object: React.PropTypes.object,
}

export default Taxonomy
