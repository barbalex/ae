/*
 * gets fieldName and an array of objects
 * returns a component with label and a number of links to the same group
 */

'use strict'

import React from 'react'
import { FormControls } from 'react-bootstrap'
import _ from 'lodash'

export default React.createClass({
  displayName: 'FieldLinkToSameGroup',

  propTypes: {
    fieldName: React.PropTypes.string,
    objects: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  render () {
    const { objects, fieldName } = this.props

    const linkArray = _.map(objects, function (object) {
      return (
        <FormControls.Static className='controls feldtext'>
          <a href='#' className='linkZuArtGleicherGruppe' ArtId={object.guid}>
            {object.Name}
          </a>
        </FormControls.Static>
      )
    })

    return (
      <div className='form-group'>
        <label className='control-label'>
          {fieldName + ':'}
        </label>
        <span className='feldtext controls'>
          {linkArray}
        </span>
      </div>
    )
  }
})
