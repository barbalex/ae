'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Group',

  propTypes: {
    group: React.PropTypes.string
  },

  onClickGruppe (group) {
    app.Actions.loadObjectStore(group)
  },

  render () {
    const { group } = this.props
    const label = group.replace('Macromycetes', 'Pilze')
    return (
      <Input type='checkbox' label={label} onClick={this.onClickGruppe.bind(this, group)} />
    )
  }
})
