/*
 * gets fieldName, fieldValue, pcType and pcName
 * returns a component with label and link
 */

'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'FieldLink',

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
          <label
            className='control-label'
            htmlFor={fieldName}
          >
            {fieldName + ':'}
          </label>
          <p>
            <a href={fieldValue}>
              <input
                className={'controls form-control input-sm'}
                dsTyp={pcType}
                dsName={pcName}
                id={fieldName}
                name={fieldName}
                type={'text'}
                value={fieldValue}
                readOnly={'readonly'}
                style={{'cursor': 'pointer'}}
              />
            </a>
          </p>
      </div>
    )
  }
})
