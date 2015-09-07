'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'Email',

  propTypes: {
    email: React.PropTypes.string
  },

  render () {
    const { email } = this.props
    const text = email ? email : 'nicht angemeldet'

    return <div id='email'>{text}</div>
  }
})
