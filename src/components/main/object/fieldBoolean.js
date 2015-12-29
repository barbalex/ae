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
    collectionIsEditing: React.PropTypes.bool
  },

  render () {
    const { fieldName, fieldValue, pcType, pcName, collectionIsEditing } = this.props

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
          readOnly={!collectionIsEditing} />
      </div>
    )
  }
})
