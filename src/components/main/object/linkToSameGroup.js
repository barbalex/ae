/*
 * gets fieldName, guid and the object's name
 * returns a component with label and a linke to the same group
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import getPathFromGuid from '../../../modules/getPathFromGuid.js'

export default React.createClass({
  displayName: 'FieldLinkToSameGroup',

  propTypes: {
    fieldName: React.PropTypes.string,
    guid: React.PropTypes.string,
    objectName: React.PropTypes.string
  },

  onClick (event) {
    event.preventDefault()
    const { guid } = this.props

    getPathFromGuid(guid)
      .then(function (result) {
        const path = result.path
        if (guid) app.Actions.loadActiveObjectStore(guid)
        app.Actions.loadPathStore(path, guid)
      })
      .catch(function (error) {
        console.log('linkToSameGroup.js: error getting path for guid ' + guid + ':', error)
      })
  },

  render () {
    const { fieldName, guid, objectName } = this.props

    getPathFromGuid(guid)
        .then(function (result) {
          const url = result.url
          return (
            <div className='form-group'>
              <label className='control-label'>
                {fieldName + ':'}
              </label>
              <p className='form-control-static controls feldtext'>
                <a href={url} className='linkZuArtGleicherGruppe' onClick={this.onClick} >
                  {objectName}
                </a>
              </p>
            </div>
          )
        })
        .catch(function (error) {
          console.log('linkToSameGroup.js: error getting path for guid ' + guid + ':', error)
        })
  }
})
