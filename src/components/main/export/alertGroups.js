'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'AlertGroups',

  propTypes: {
    taxonomienZusammenfassen: React.PropTypes.bool,
    fieldsQuerying: React.PropTypes.bool,
    fields: React.PropTypes.array
  },

  // TODO: add progressbar?
  render () {
    const { taxonomienZusammenfassen, fieldsQuerying, fields } = this.props
    console.log('AlertGroups, render, fields', fields)
    // fieldsQuerying === true && fields.length === 0
    let resultText = 'Die Eigenschaften werden aufgebaut...'
    let taxonomienZusammenfassenText = null
    let bsStyle = 'info'
    if (fieldsQuerying && fields.length > 0) {
      resultText = 'Die Eigenschaften werden ergänzt...'
    }
    if (!fieldsQuerying && fields.length > 0) {
      bsStyle = 'success'
      resultText = 'Die Eigenschaften wurden aufgebaut.'
      taxonomienZusammenfassenText = taxonomienZusammenfassen ? 'Taxonomien werden zusammengefasst.' : 'Taxonomien werden einzeln dargestellt.'
    }
    // TODO: add version for error
    
    const style = {
      marginTop: 8,
      marginBottom: 0
    }
    const showFirstTime = fieldsQuerying && fields.length === 0
    return (
      <Alert bsStyle={bsStyle} style={style}>
        <p>{resultText}</p>
        {showFirstTime ? <p>Beim ersten Mal dauert das besonders lang, falls der Index aufgebaut werden muss.</p> : null}
        <p>{taxonomienZusammenfassenText}</p>
      </Alert>
    )
  }
})
