/*
 * gets fieldName, fieldValue, inputType, pcType and pcName
 * returns a component with label and input
 */

'use strict'

import React from 'react'
import { State } from 'react-router'
import Textarea from 'react-textarea-autosize'

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
      <div>
        <label htmlFor={fieldName} className='control-label'>
          <span>{fieldName + ':'}</span>
        </label>
        <Textarea
          bsSize='small'
          dsTyp={pcType}
          dsName={pcName}
          id={fieldName}
          name={fieldName}
          value={fieldValue}
          readOnly={'readonly'}
          className={'controls form-control'}
        />
      </div>
    )
  }
})
