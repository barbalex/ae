'use strict'

import React from 'react'
import RelationCollection from './rc.js'

export default React.createClass({
  displayName: 'RcsOfSynonyms',

  propTypes: {
    rcsOfSynonyms: React.PropTypes.array
  },

  render () {
    const { rcsOfSynonyms } = this.props
    let rcsComponent = null

    if (rcsOfSynonyms.length > 0) {
      rcsComponent = rcsOfSynonyms.map((rc, index) => <RelationCollection key={index} relationCollection={rc}/>)
    }

    return (
      <div>
        <h4>Beziehungen von Synonymen:</h4>
        {rcsComponent}
      </div>
    )
  }
})
