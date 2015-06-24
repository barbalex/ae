/*
 * gets fieldName, fieldValue, pcType and pcName
 * returns a component with label and textarea
 */

'use strict'

import React from 'react'
import { State } from 'react-router'

export default React.createClass({
  displayName: 'FieldInputText',

  mixins: [State],

  propTypes: {
    fieldName: React.PropTypes.string,
    fieldValue: React.PropTypes.string,
    pcType: React.PropTypes.string,
    pcName: React.PropTypes.string
  },

  getInitialState () {
    return {
      fieldName: this.props.fieldName,
      fieldValue: this.props.fieldValue,
      pcType: this.props.pcType,
      pcName: this.props.pcName
    }
  },

  render () {
    const fieldName = this.state.fieldName
    return (
      <div className='form-group'>
          <label
            className='control-label'
            htmlFor={fieldName}
          >
            {fieldName + ':'}
          </label>
          <textarea
            className={'controls form-control'}
            dsTyp={this.state.pcType}
            dsName={this.state.pcName}
            id={fieldName}
            name={fieldName}
            type={this.state.inputType}
            readOnly={'readonly'}
            defaultValue={this.state.fieldValue}
          />
      </div>
    )
  }
})
