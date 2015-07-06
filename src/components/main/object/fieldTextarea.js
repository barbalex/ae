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
    pcName: React.PropTypes.string
  },

  render () {
    const { fieldName, fieldValue, pcType, pcName } = this.props

    return (
      <div className='form-group'>
        <label htmlFor={fieldName} className='control-label'>
          <span>{fieldName + ':'}</span>
        </label>
        <Textarea
          dsTyp={pcType}
          dsName={pcName}
          id={fieldName}
          name={fieldName}
          readOnly={'readonly'}
          className={'controls form-control'}
          defaultValue={fieldValue}
        />
      </div>
    )
  }
})
