/*
 * gets fieldName, fieldValue, esType and esName
 * returns a component with label and textarea
 */

'use strict'

import React from 'react'
import { State } from 'react-router'

export default function (fieldName, fieldValue, esType, esName) {
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
            <textarea
              className={'controls form-control'}
              dsTyp={esType}
              dsName={esName}
              id={fieldName}
              name={fieldName}
              type={inputType}
              readOnly={'readonly'}
            >
              {fieldValue}
            </textarea>
        </div>
      )
    }
  })
}
