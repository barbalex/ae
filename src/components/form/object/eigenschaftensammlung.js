'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'Eigenschaftensammlung',

  render () {
    return (
      <p>Eigenschaftensammlung für GUID {this.props.object._id}</p>
    )
  }
})
