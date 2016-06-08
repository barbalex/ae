import React from 'react'
import PropertyCollection from './Pc.js'

const PcsOfSynonyms = ({ pcsOfSynonyms }) => {
  let pcsComponent = null

  if (pcsOfSynonyms.length > 0) {
    pcsComponent = pcsOfSynonyms.map((pc, index) => (
      <PropertyCollection
        key={index}
        pcType="Datensammlung"
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
  pcsOfSynonyms: React.PropTypes.array
}

export default PcsOfSynonyms
