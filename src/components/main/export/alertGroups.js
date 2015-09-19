'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'AlertGroups',

  propTypes: {
    taxonomienZusammenfassen: React.PropTypes.bool,
    fieldsQuerying: React.PropTypes.bool,
    fieldsQueryingError: React.PropTypes.string,
    taxonomyFields: React.PropTypes.object
  },

  render () {
    const { taxonomienZusammenfassen, fieldsQuerying, fieldsQueryingError, taxonomyFields } = this.props
    // fieldsQuerying && taxonomyFields.length === 0
    let resultText = 'Die Eigenschaften werden aufgebaut...'
    let taxonomienZusammenfassenText = null
    let bsStyle = 'info'
    if (fieldsQuerying && Object.keys(taxonomyFields).length > 0) {
      resultText = 'Die Eigenschaften werden ergänzt...'
    }
    if (!fieldsQuerying && Object.keys(taxonomyFields).length > 0) {
      bsStyle = 'success'
      resultText = 'Die Eigenschaften wurden aufgebaut.'
      taxonomienZusammenfassenText = taxonomienZusammenfassen ? 'Taxonomien werden zusammengefasst.' : 'Taxonomien werden einzeln dargestellt.'
    }
    if (fieldsQueryingError) {
      bsStyle = 'danger'
      resultText = 'Fehler: ' + fieldsQueryingError
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
        {showFirstTime ? <p>Beim ersten Mal dauert das einige Minuten, falls der Index aufgebaut werden muss.</p> : null}
        <p>{taxonomienZusammenfassenText}</p>
      </Alert>
    )
  }
})
