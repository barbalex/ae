'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'
import _ from 'lodash'

export default React.createClass({
  displayName: 'AlertFirst10Imported',

  propTypes: {
    objectsToImportPcsInTo: React.PropTypes.array,
    idsNotImportable: React.PropTypes.array
  },

  render () {
    const { objectsToImportPcsInTo, idsNotImportable } = this.props
    const idsOfObjects = _.pluck(objectsToImportPcsInTo, '_id')
    const idsImported = _.difference(idsOfObjects, idsNotImportable)
    const first10Ids = idsImported.slice(0, 5)
    const alertStyle = { marginTop: 11 }

    const examples = first10Ids.map((id, index) => {
      const href = `${window.location.host}/${id}`
      return <li key={index}><a href={href} target='_blank'>Beispiel {index + 1}</a></li>
    })

    return (
      <Alert bsStyle='info' style={alertStyle}>
        <p>{idsImported.length} Datensätze wurden importiert.<br/>
          5 Beispiele zur Kontrolle:
        </p>
        <ul>{examples}</ul>
      </Alert>
    )
  }
})
