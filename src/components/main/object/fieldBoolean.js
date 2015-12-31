/*
 * gets fieldName, fieldValue, pcType and pcName
 * returns a component with label and checkbox
 */

'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'FieldBoolean',

  propTypes: {
    fieldName: React.PropTypes.string,
    fieldValue: React.PropTypes.bool,
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

    // need to place checkboxes next to labels, not inside
    // makes styling MUCH easier
    return (
      <div className={'form-group'}>
        <label
          className={'control-label'}
          htmlFor={fieldName}
        >
          {fieldName + ':'}
        </label>
        <input
          type='checkbox'
          dsTyp={pcType}
          dsName={pcName}
          id={fieldName}
          name={fieldName}
          checked={fieldValue}
          readOnly={!collectionIsEditing}
          onChange={this.onChange}
          onBlur={this.onBlur} />
      </div>
    )
  }
})
