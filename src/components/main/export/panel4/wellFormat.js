'use strict'

import React from 'react'
import { Input, Well } from 'react-bootstrap'

const WellFormat = ({ format, onChangeFormat }) =>
  <Well bsSize="small">
    <p style={{ marginBottom: 3 }}>
      <strong>Format:</strong>
    </p>
    <div
      style={{
        marginLeft: 12,
        marginBottom: `${-8}px`
      }}
    >
      <Input
        type="checkbox"
        label="xlsx (Excel)"
        onChange={() => onChangeFormat('xlsx')}
        checked={format === 'xlsx'}
      />
    </div>
    <div
      style={{
        marginLeft: 12,
        marginBottom: `${-7}px`
      }}
    >
      <Input
        type="checkbox"
        label="csv (kommagetrennte Textdatei)"
        onChange={() => onChangeFormat('csv')}
        checked={format === 'csv'}
      />
    </div>
  </Well>

WellFormat.displayName = 'WellFormat'

WellFormat.propTypes = {
  format: React.PropTypes.string,
  onChangeFormat: React.PropTypes.func
}

export default WellFormat
