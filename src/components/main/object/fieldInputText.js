/*
 * gets fieldName, fieldValue, esType and esName
 * returns a component with label and link
 */

'use strict'

import React from 'react'
import { State } from 'react-router'

export default function (fieldName, fieldValue, inputType, esType, esName) {
  return React.createClass({
    displayName: 'FieldInputText',

    mixins: [State],

    propTypes: {
      fieldName: React.PropTypes.string,
      fieldValue: React.PropTypes.string,
      esType: React.PropTypes.string,
      esName: React.PropTypes.string
    },

    getInitialState () {
      const state = {
        fieldName: fieldName,
        fieldValue: fieldValue,
        esType: esType,
        esName: esName
      }
      return state
    },

    render () {
      return (
        <div className='form-group'>
            <label
              className='control-label'
              htmlFor={fieldName + ':'}
            >
              {fieldName}
            </label>
            <input
              className={'controls form-control input-sm'}
              dsTyp={esType}
              dsName={esName}
              id={fieldName}
              name={fieldName}
              type={inputType}
              value={fieldValue}
              readOnly={'readonly'}
            />
        </div>
      )
    }
  })
}
