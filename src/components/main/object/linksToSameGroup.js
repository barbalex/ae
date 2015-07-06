/*
 * gets fieldName and an array of objects
 * returns a component with label and a number of links to the same group
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import _ from 'lodash'
import getPathFromGuid from '../../../modules/getPathFromGuid.js'

export default React.createClass({
  displayName: 'FieldLinkToSameGroup',

  propTypes: {
    fieldName: React.PropTypes.string,
    objects: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  onClick (guid, event) {
    event.preventDefault()
    const path = getPathFromGuid(guid).path
    if (guid) app.Actions.loadActiveObjectStore(guid)
    app.Actions.loadPathStore(path)
  },

  render () {
    const { objects, fieldName } = this.props
    const that = this

    const linkArray = _.map(objects, function (object) {
      const url = getPathFromGuid(object.guid).url
      return (
        <p className='controls feldtext'>
          <a href={url} className='form-control-static linkZuArtGleicherGruppe' onClick={that.onClick.bind(that, object._id)}>
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
