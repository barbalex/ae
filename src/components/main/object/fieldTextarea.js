/*
 * gets fieldName, fieldValue, inputType, pcType and pcName
 * returns a component with label and input
 */

'use strict'

import React from 'react'
import Textarea from 'react-textarea-autosize'

export default React.createClass({
  displayName: 'FieldTextarea',

  propTypes: {
    fieldName: React.PropTypes.string,
    fieldValue: React.PropTypes.string,
    pcType: React.PropTypes.string,
    pcName: React.PropTypes.string,
    collectionIsEditing: React.PropTypes.bool,
    onSaveObjectField: React.PropTypes.func
  },

  onChange () {
    const { fieldName, pcType, pcName, onSaveObjectField } = this.props
    const fieldValue = this.myInput.value
    const save = false
    onSaveObjectField(pcType, pcName, fieldName, fieldValue, save)
  },

  onBlur () {
    const { fieldName, fieldValue, pcType, pcName, onSaveObjectField } = this.props
    const newFieldValue = this.myInput.value
    if (newFieldValue !== fieldValue) {
      const save = true
      onSaveObjectField(pcType, pcName, fieldName, newFieldValue, save)
    }
  },

  render() {
    const { fieldName, fieldValue, pcType, pcName, collectionIsEditing } = this.props

    return (
      <div className='form-group form-group-sm'>
        <label
          htmlFor={fieldName}
          className='control-label'>
          <span>
            {fieldName + ':'}
          </span>
        </label>
        <Textarea
          ref={(c) => this.myInput = c}
          dsTyp={pcType}
          dsName={pcName}
          id={fieldName}
          name={fieldName}
          readOnly={!collectionIsEditing}
          className='controls form-control'
          defaultValue={fieldValue}
          onChange={this.onChange}
          onBlur={this.onBlur} />
      </div>
    )
  }
})
