/*
 * gets fieldName, fieldValue, pcType and pcName
 * returns a component with label and checkbox
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
    const fieldValue = this.state.fieldValue
    const pcType = this.state.pcType
    const pcName = this.state.pcName

    return (
      <div className='form-group'>
          <label
            className='control-label'
            htmlFor={fieldName}
          >
            {fieldName + ':'}
          </label>
          <input
            className={'controls form-control input-sm'}
            dsTyp={pcType}
            dsName={pcName}
            id={fieldName}
            name={fieldName}
            type={'checkbox'}
            checked={fieldValue}
            readOnly={'readonly'}
          />
      </div>
    )
  }
})
