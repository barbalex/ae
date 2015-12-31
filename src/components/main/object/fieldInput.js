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
    const { fieldName, inputType, pcType, pcName, collectionIsEditing } = this.props
    const { fieldValue } = this.state

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
        readOnly={!collectionIsEditing}
        className='controls'
        onChange={this.onChange}
        onBlur={this.onBlur} />
    )
  }
})
