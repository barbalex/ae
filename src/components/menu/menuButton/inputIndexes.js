'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputIndexes',

  propTypes: {
    offlineIndexes: React.PropTypes.bool,
    onClickToggleOfflineIndexes: React.PropTypes.func
  },

  render () {
    const { offlineIndexes, onClickToggleOfflineIndexes } = this.props
    const liStyle = {
      paddingLeft: 20,
      paddingRight: 20
    }

    return (
      <li style={liStyle}>
        <Input type='checkbox' label='Indizes von arteigenschaften.ch verwenden (empfohlen)' checked={!offlineIndexes} onChange={onClickToggleOfflineIndexes} />
        <Input type='checkbox' label='lokale Indizes verwenden' checked={offlineIndexes} onChange={onClickToggleOfflineIndexes} />
      </li>
    )
  }
})
