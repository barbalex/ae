'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'Object',

  componentDidMount () {
    // start listening to the store
    this.unsubscribe = window.faunaStore.listen(this.onFaunaStoreChange)
  },

  componentWillUnmount () {
    this.unsubscribe
  },

  render () {
    return (
      <div>
        <fieldset id='forms'/>
      </div>
    )
  }
})
