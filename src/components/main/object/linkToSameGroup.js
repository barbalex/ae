/*
 * gets fieldName, guid and the object's name
 * returns a component with label and a linke to the same group
 */

'use strict'

import React from 'react'
import { FormControls } from 'react-bootstrap'

export default React.createClass({
  displayName: 'FieldLinkToSameGroup',

  propTypes: {
    fieldName: React.PropTypes.string,
    guid: React.PropTypes.string,
    objectName: React.PropTypes.string
  },

  render () {
    const { fieldName, guid, objectName } = this.props

    return (
      <div className='form-group'>
        <label className='control-label'>
          {fieldName + ':'}
        </label>
        <FormControls.Static className='controls feldtext'>
          <a href='#' className='linkZuArtGleicherGruppe' ArtId={guid}>
            {objectName}
          </a>
        </FormControls.Static>
      </div>
    )
  }
})
