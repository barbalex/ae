'use strict'

import React from 'react'
import PropertyCollection from './propertyCollection.js'

export default React.createClass({
  displayName: 'PropertyCollections',

  propTypes: {
    object: React.PropTypes.object
  },

  render () {
    const { object } = this.props
    const pcs = object.Eigenschaftensammlungen
    let pcComponent = null
    if (pcs && pcs.length > 0) {
      pcComponent = pcs.map((pc, index) => <PropertyCollection key={index} pcType='Datensammlung' object={object} propertyCollection={pc}/>)
    }

    return (
      <div>
        <h4>Eigenschaften:</h4>
        {pcComponent}
      </div>
    )
  }
})
