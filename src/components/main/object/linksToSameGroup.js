/*
 * gets fieldName and an array of objects
 * returns a component with label and a number of links to the same group
 */

'use strict'

import React from 'react'
import _ from 'lodash'
import getPathFromGuid from '../../../modules/getPathFromGuid.js'

export default React.createClass({
  displayName: 'FieldLinkToSameGroup',

  propTypes: {
    fieldName: React.PropTypes.string,
    objects: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  render () {
    const { objects, fieldName } = this.props

    const linkArray = _.map(objects, function (object) {
      const url = getPathFromGuid(object.guid).url
      return (
        <p className='controls feldtext'>
          <a href={url} className='form-control-static linkZuArtGleicherGruppe' ArtId={object.guid}>
            {object.Name}
          </a>
        </p>
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
