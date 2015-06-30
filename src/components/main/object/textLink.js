/*
 * gets label, value, and url
 * returns a component with label and link
 * where the link is in a p element
 */

'use strict'

import React from 'react'
import { State } from 'react-router'

export default React.createClass({
  displayName: 'FieldLink',

  mixins: [State],

  propTypes: {
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    url: React.PropTypes.string
  },

  getInitialState () {
    return {
      label: this.props.label,
      value: this.props.value,
      url: this.props.url
    }
  },

  render () {
    const label = this.state.label
    const value = this.state.label
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
              target='_blank'
            >
              {value}
            </a>
          </p>
      </div>
    )
  }
})
