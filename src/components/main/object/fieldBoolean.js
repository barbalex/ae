/*
 * gets fieldName, fieldValue, pcType and pcName
 * returns a component with label and checkbox
 */

'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'FieldInputText',

  propTypes: {
    fieldName: React.PropTypes.string,
    fieldValue: React.PropTypes.string,
    pcType: React.PropTypes.string,
    pcName: React.PropTypes.string
  },

  render () {
    const { fieldName, fieldValue, pcType, pcName } = this.props

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
          readOnly={'readonly'}
        />
      </div>
    )
  }
})
