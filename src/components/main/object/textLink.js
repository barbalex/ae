/*
 * gets label, value, and url
 * returns a component with label and link
 * where the link is in a p element
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation } from 'react-router'
import _ from 'lodash'
import getPathFromGuid from '../../../modules/getPathFromGuid.js'

export default React.createClass({
  displayName: 'FieldLink',

  mixins: [State, Navigation],

  propTypes: {
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    url: React.PropTypes.string,
    gruppe: React.PropTypes.string,
    guid: React.PropTypes.string
  },

  getInitialState () {
    return {
      label: this.props.label,
      value: this.props.value,
      url: this.props.url,
      gruppe: this.props.gruppe,
      guid: this.props.guid
    }
  },

  onClickUrl (event) {
    event.preventDefault()
    const gruppe = this.state.gruppe
    const guid = this.state.guid
    if (gruppe && guid) {
      const groupsLoaded = window.objectStore.getGroupsLoaded()
      if (_.includes(groupsLoaded, gruppe)) {
        const url = getPathFromGuid(guid)
        this.transitionTo(url)
        this.forceUpdate()
      } else {
        app.Actions.loadObjectStore(gruppe)
        this.transitionTo('/' + guid)
      }
    } else {
      this.transitionTo(this.state.url)
      this.forceUpdate()
    }
  },

  render () {
    const label = this.state.label
    const value = this.state.value
    const url = this.state.url

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
