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
  displayName: 'FieldLinksToSameGroup',

  propTypes: {
    fieldName: React.PropTypes.string,
    objects: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  onClick (guid, event) {
    event.preventDefault()
    getPathFromGuid(guid)
      .then((result) => {
        const path = result.path
        if (guid) app.Actions.loadActiveObjectStore(guid)
        app.Actions.loadActivePathStore(path, guid)
      })
      .catch((error) =>
        app.Actions.showError({title: 'linksToSameGroup.js: error getting path for guid ' + guid + ':', msg: error})
      )
  },

  render () {
    const { objects, fieldName } = this.props
    const that = this

    const linkArray = _.map(objects, (object) => {
      getPathFromGuid(object.guid)
        .then((result) => {
          const url = result.url
          return (
            <p className='controls feldtext'>
              <a href={url} className='form-control-static linkZuArtGleicherGruppe' onClick={that.onClick.bind(that, object._id)}>
                {object.Name}
              </a>
            </p>
          )
        })
        .catch((error) =>
          app.Actions.showError({title: 'linksToSameGroup.js: error getting path for guid ' + object.guid + ':', msg: error})
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
