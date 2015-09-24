'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'AlertGroups',

  propTypes: {
    taxonomienZusammenfassen: React.PropTypes.bool,
    fieldsQuerying: React.PropTypes.bool,
    fieldsQueryingError: React.PropTypes.object,
    taxonomyFields: React.PropTypes.object,
    pcsQuerying: React.PropTypes.bool,
    rcsQuerying: React.PropTypes.bool
  },

  render () {
    const { taxonomienZusammenfassen, fieldsQuerying, fieldsQueryingError, taxonomyFields, pcsQuerying, rcsQuerying } = this.props
    // fieldsQuerying && taxonomyFields.length === 0
    let resultText = 'Die Eigenschaften werden aufgebaut...'
    let taxonomienZusammenfassenText = null
    let bsStyle = 'info'
    const somethingQuerying = fieldsQuerying || pcsQuerying || rcsQuerying
    if (somethingQuerying && Object.keys(taxonomyFields).length > 0) {
      resultText = 'Die Eigenschaften werden ergänzt...'
    }
    if (!somethingQuerying && Object.keys(taxonomyFields).length > 0) {
      bsStyle = 'success'
      resultText = 'Die Eigenschaften wurden aufgebaut.'
      taxonomienZusammenfassenText = taxonomienZusammenfassen ? 'Taxonomien werden zusammengefasst.' : 'Taxonomien werden einzeln dargestellt.'
    }
    if (fieldsQueryingError) {
      bsStyle = 'danger'
      resultText = 'Fehler: ' + JSON.stringify(fieldsQueryingError)
      taxonomienZusammenfassenText = null
    }
    const style = {
      marginTop: 8,
      marginBottom: 0
    }
    const showFirstTime = fieldsQuerying && bsStyle === 'info'
    return (
      <Alert bsStyle={bsStyle} style={style}>
        <p>{resultText}</p>
        {showFirstTime ? <p>Das kann ein paar Minuten dauern, wenn der Index aufgebaut werden muss.</p> : null}
        <p>{taxonomienZusammenfassenText}</p>
      </Alert>
    )
  }
})
