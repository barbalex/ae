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
          Importieren können Sie nur, wenn Ihnen von einer Organisation entsprechende Schreibrechte erteilt wurden.<br/>
          Da Sie keine Schreibrechte haben, können Sie keine Eigenschaften importieren.<br/>
          Wenn Sie Eigenschaften importieren möchten, wenden Sie sich bitte an eine der beteiligten Organisationen, z.B. <a href='mailto:andreas.lienhard@bd.zh.ch'>die Fachstelle Naturschutz des Kantons Zürich</a>.
        </Alert>
      </div>
    )
  }
})
