'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'AlertGroups',

  propTypes: {
    taxonomienZusammenfassen: React.PropTypes.bool,
    buildingFields: React.PropTypes.bool,
    pcs: React.PropTypes.array,
    rcs: React.PropTypes.array
  },

  // TODO: add progressbar?
  render () {
    const { taxonomienZusammenfassen, buildingFields, pcs, rcs } = this.props
    // TODO: style depending on success or error
    let bsStyle = 'info'
    if (buildingFields) bsStyle = 'info'
    if (!buildingFields && (pcs.length > 0 || rcs.length > 0)) bsStyle = 'success'
    // TODO: add version for error
    const resultText = 'Die Eigenschaften wurden aufgebaut.'
    const taxonomienZusammenfassenText = taxonomienZusammenfassen ? 'Taxonomien werden zusammengefasst.' : 'Taxonomien werden einzeln dargestellt.'
    const style = {
      marginBottom: 5
    }
    return (
      <Alert bsStyle={bsStyle} style={style}>
        <p>{resultText}</p>
        <p>{taxonomienZusammenfassenText}</p>
      </Alert>
    )
  }
})
