/*
 * gets label, value, and url
 * returns a component with label and link
 * where the link is in a p element
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'

export default React.createClass({
  displayName: 'FieldLink',

  propTypes: {
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    url: React.PropTypes.string,
    gruppe: React.PropTypes.string,
    guid: React.PropTypes.string
  },

  onClickUrl (event) {
    event.preventDefault()
    const guid = this.props.guid
    if (guid) app.Actions.loadActiveObjectStore(guid)
  },

  render () {
    const { label, value, url } = this.props

    return (
      <div className='form-group'>
          <label
            className='control-label'
          >
            {label + ':'}
          </label>
          <p
            className='form-control-static feldtext controls'
          >
            <a
              href={url}
              onClick={this.onClickUrl}
            >
              {value}
            </a>
          </p>
      </div>
    )
  }
})
