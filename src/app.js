'use strict'

import React from 'react'

const Hello = React.createClass({
  displayName: 'hello',
  render () {
    return <div>Hello, {this.props.name}</div>
  }
})

React.render(<Hello name='world'/>, document.body)
