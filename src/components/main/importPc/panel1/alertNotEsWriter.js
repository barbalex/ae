'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'

export default React.createClass({
  displayName: 'AlertNotEsWriter',

  render () {
    const style = {
      marginBottom: 5
    }
    return (
      <div
        className='form-group'>
        <Alert
          className='feld'
          bsStyle='danger'
          style={style}>
          Sie besitzen keine Schreibrechte.<br/>
          Importieren kann nur, wer von einer beteiligten Organisation Schreibrechte erhält.<br/>
          Wenn Sie Eigenschaften importieren möchten, wenden Sie sich bitte an <a href='mailto:andreas.lienhard@bd.zh.ch'>die Fachstelle Naturschutz des Kantons Zürich</a>.
        </Alert>
      </div>
    )
  }
})
