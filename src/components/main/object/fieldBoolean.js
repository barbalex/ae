/*
 * gets fieldName, fieldValue, pcType and pcName
 * returns a component with label and checkbox
 */

'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'FieldInputText',

  propTypes: {
    fieldName: React.PropTypes.string,
    fieldValue: React.PropTypes.string,
    pcType: React.PropTypes.string,
    pcName: React.PropTypes.string
  },

  render () {
    const { fieldName, fieldValue, pcType, pcName } = this.props

    return (
      <Input
        type='checkbox'
        label={fieldName + ':'}
        dsTyp={pcType}
        dsName={pcName}
        id={fieldName}
        name={fieldName}
        checked={fieldValue}
        readOnly={'readonly'}
      />
    )
  }
})
