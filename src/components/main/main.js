'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State } from 'react-router'
import { ListenerMixin } from 'reflux'

export default React.createClass({
  displayName: 'Object',

  // ListenerMixin provides the listenTo method for the React component,
  // that works much like the one found in the Reflux's stores,
  // and handles the listeners during mount and unmount for you.
  // You also get the same listenToMany method as the store has.
  mixins: [ListenerMixin, State],

  propTypes: {
    loading: React.PropTypes.bool,
    items: React.PropTypes.object,
    s2: React.PropTypes.string,
    s3: React.PropTypes.string,
    s4: React.PropTypes.string,
    s5: React.PropTypes.string  // in Fauna guid
  },

  getInitialState () {
    const params = this.getParams()
    return {
      loading: !window.faunaStore.loaded,
      items: window.faunaStore.getInitialState(),
      s2: params.s2,
      s3: params.s3,
      s4: params.s4,
      s5: params.s5  // in Fauna guid
    }
  },

  componentDidMount () {
    this.listenTo(window.faunaStore, this.onStoreChange)
    // loadFaunaStore if necessary
    if (!window.faunaStore.loaded) app.Actions.loadFaunaStore()
  },

  onStoreChange (items) {
    this.setState({
      loading: false,
      items: items
    })
  },

  render () {
    return (
      <fieldset id='main'>
        <form className='form form-horizontal' autoComplete='off'>
          <p>i am main</p>
        </form>
      </fieldset>
    )
  }
})
