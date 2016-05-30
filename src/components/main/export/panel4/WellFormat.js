'use strict'

import React from 'react'
import { Checkbox, Well } from 'react-bootstrap'

const WellFormat = ({ format, onChangeFormat }) =>
  <Well bsSize="small">
    <p style={{ marginBottom: 3 }}>
      <strong>Format:</strong>
    </p>
    <Checkbox
      onChange={() =>
        onChangeFormat('xlsx')
      }
      checked={format === 'xlsx'}
    >
      xlsx (Excel)
    </Checkbox>
    <Checkbox
      onChange={() =>
        onChangeFormat('csv')
      }
      checked={format === 'csv'}
    >
      csv (kommagetrennte Textdatei)
    </Checkbox>
  </Well>

WellFormat.displayName = 'WellFormat'

WellFormat.propTypes = {
  format: React.PropTypes.string,
  onChangeFormat: React.PropTypes.func
}

export default WellFormat
