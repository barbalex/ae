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
    pcName: React.PropTypes.string,
    collectionIsEditing: React.PropTypes.bool,
    onSaveObjectField: React.PropTypes.func
  },

  onChange () {
    const { fieldName, pcType, pcName, onSaveObjectField } = this.props
    const fieldValue = this.myInput.getValue()
    const save = false
    onSaveObjectField(pcType, pcName, fieldName, fieldValue, save)
  },

  onBlur () {
    const { fieldName, fieldValue, pcType, pcName, onSaveObjectField } = this.props
    const newFieldValue = this.myInput.getValue()
    if (newFieldValue !== fieldValue) {
      const save = true
      onSaveObjectField(pcType, pcName, fieldName, newFieldValue, save)
    }
  },

  render () {
    const { fieldName, fieldValue, inputType, pcType, pcName, collectionIsEditing } = this.props

    return (
      <Input
        ref={(c) => this.myInput = c}
        type={inputType}
        label={fieldName + ':'}
        bsSize='small'
        dsTyp={pcType}
        dsName={pcName}
        id={fieldName}
        name={fieldName}
        value={fieldValue}
        readOnly={!collectionIsEditing}
        className='controls'
        onChange={this.onChange}
        onBlur={this.onBlur} />
    )
  }
})
