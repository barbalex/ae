/*
 * gets fieldName, fieldValue, pcType and pcName
 * returns a component with label and link
 */

'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'FieldLink',

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

    if (collectionIsEditing) {
      return (
        <div className={'form-group'}>
          <label
            className={'control-label'}
            htmlFor={fieldName}
          >
            {fieldName + ':'}
          </label>
          <input
            ref={(c) => this.myInput = c}
            type='text'
            dsTyp={pcType}
            dsName={pcName}
            id={fieldName}
            name={fieldName}
            value={fieldValue}
            className='controls form-control input-sm'
            onChange={this.onChange}
            onBlur={this.onBlur} />
        </div>
      )
    }

    return (
      <div className='form-group'>
        <label
          className='control-label'
          htmlFor={fieldName}
        >
          {fieldName + ':'}
        </label>
        <p>
          <a href={fieldValue}>
            <input
              ref={(c) => this.myInput = c}
              dsTyp={pcType}
              dsName={pcName}
              id={fieldName}
              name={fieldName}
              type='text'
              value={fieldValue}
              readOnly={!collectionIsEditing}
              className='controls form-control input-sm'
              style={{'cursor': 'pointer'}}
              onChange={this.onChange}
              onBlur={this.onBlur} />
          </a>
        </p>
      </div>
    )
  }
})
