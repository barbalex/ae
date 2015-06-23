'use strict'

import React from 'react'
import { State } from 'react-router'

export default function (fieldName, fieldValue, esType, esName) {
  return React.createClass({
    displayName: 'FieldLink',

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
            <label className='control-label' htmlFor={fieldName + ':'}>{fieldName}</label>
            <p>
              <a href={fieldValue}>
                <input
                  className={'controls form-control input-sm'}
                  dsTyp={esType}
                  dsName={esName}
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
}
