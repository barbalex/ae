/*
 * gets fieldName, fieldValue, pcType and pcName
 * returns a component with label and link
 */

'use strict'

import React from 'react'
import { State } from 'react-router'

export default React.createClass({
  displayName: 'FieldLink',

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
    const fieldValue = this.state.fieldName
    const pcType = this.state.pcType
    const pcName = this.state.pcType

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
