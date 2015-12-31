/*
 * gets fieldName, fieldValue, pcType and pcName
 * returns a component with label and link
 */

'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'FieldLink',

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

    if (collectionIsEditing) {
      return (
        <Input
          type='text'
          label={fieldName + ':'}
          bsSize='small'
          dsTyp={pcType}
          dsName={pcName}
          id={fieldName}
          name={fieldName}
          value={fieldValue}
          className='controls'
          onChange={this.onChange}
          onBlur={this.onBlur} />
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
              className='controls form-control input-sm'
              dsTyp={pcType}
              dsName={pcName}
              id={fieldName}
              name={fieldName}
              type='text'
              value={fieldValue}
              readOnly={!collectionIsEditing}
              style={{'cursor': 'pointer'}}
              onChange={this.onChange}
              onBlur={this.onBlur} />
          </a>
        </p>
      </div>
    )
  }
})
