'use strict'

import React from 'react'
import { Checkbox, Well } from 'react-bootstrap'

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
      <Checkbox
        onChange={() =>
          onChangeFormat('xlsx')
        }
        checked={format === 'xlsx'}
      >
        xlsx (Excel)
      </Checkbox>
    </div>
    <div
      style={{
        marginLeft: 12,
        marginBottom: `${-7}px`
      }}
    >
      <Checkbox
        onChange={() =>
          onChangeFormat('csv')
        }
        checked={format === 'csv'}
      >
        csv (kommagetrennte Textdatei)
      </Checkbox>
    </div>
  </Well>

WellFormat.displayName = 'WellFormat'

WellFormat.propTypes = {
  format: React.PropTypes.string,
  onChangeFormat: React.PropTypes.func
}

export default WellFormat
