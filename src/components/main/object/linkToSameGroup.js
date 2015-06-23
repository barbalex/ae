/*
 * gets fieldName, guid and the object's name
 * returns a component with label and a linke to the same group
 */

'use strict'

import React from 'react'
import { State } from 'react-router'

export default function (fieldName, guid, objectName) {
  return React.createClass({
    displayName: 'FieldLinkToSameGroup',

    mixins: [State],

    propTypes: {
      fieldName: React.PropTypes.string,
      guid: React.PropTypes.string,
      objectName: React.PropTypes.string
    },

    getInitialState () {
      return {
        fieldName: fieldName,
        guid: guid,
        objectName: objectName
      }
    },

    render () {
      return (
        <div className='form-group'>
          <label className='control-label'>
            {fieldName + ':'}
          </label>
          <p className='form-control-static controls feldtext'>
            <a href='#' className='linkZuArtGleicherGruppe' ArtId={guid}>
              {objectName}
            </a>
          </p>
        </div>
      )
    }
  })
}
