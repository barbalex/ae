'use strict'

import React from 'react'
import { Input, Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Format',

  propTypes: {
    format: React.PropTypes.string,
    onChangeFormat: React.PropTypes.func
  },

  onChangeFormat (format) {
    const { onChangeFormat } = this.props
    onChangeFormat(format)
  },

  render () {
    const { format } = this.props
    return (
      <Well bsSize='small'>
        <p style={{marginBottom: 3}}><strong>Format:</strong></p>
        <div style={{marginLeft: 12, marginBottom: -8 + 'px'}}>
          <Input
            type='checkbox'
            label='xlsx (Excel)'
            onChange={this.onChangeFormat.bind(this, 'xlsx')}
            checked={format === 'xlsx'} />
        </div>
        <div style={{marginLeft: 12, marginBottom: -7 + 'px'}}>
          <Input
            type='checkbox'
            label='csv (kommagetrennte Textdatei)'
            onChange={this.onChangeFormat.bind(this, 'csv')}
            checked={format === 'csv'} />
        </div>
      </Well>
    )
  }
})
