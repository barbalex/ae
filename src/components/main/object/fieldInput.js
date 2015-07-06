/*
 * gets fieldName, fieldValue, inputType, pcType and pcName
 * returns a component with label and input
 */

'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'FieldInput',

  propTypes: {
    fieldName: React.PropTypes.string,
    fieldValue: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.bool
    ]),
    inputType: React.PropTypes.string,
    pcType: React.PropTypes.string,
    pcName: React.PropTypes.string
  },

  render () {
    const { fieldName, fieldValue, inputType, pcType, pcName } = this.props

    return (
      <Input
        type={inputType}
        label={fieldName + ':'}
        bsSize='small'
        dsTyp={pcType}
        dsName={pcName}
        id={fieldName}
        name={fieldName}
        value={fieldValue}
        readOnly={'readonly'}
        className={'controls'}
      />
    )
  }
})
