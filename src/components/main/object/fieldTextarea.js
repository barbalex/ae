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
    onChangeObjectField: React.PropTypes.func
  },

  getInitialState () {
    const { fieldValue } = this.props
    return { fieldValue }
  },

  onChange (event) {
    const fieldValue = event.target.value
    this.setState({ fieldValue })
  },

  onBlur (event) {
    const { fieldName, pcType, pcName, onChangeObjectField } = this.props
    const fieldValue = event.target.value
    onChangeObjectField(pcType, pcName, fieldName, fieldValue)
  },

  render () {
    const { fieldName, pcType, pcName, collectionIsEditing } = this.props
    const { fieldValue } = this.state

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
