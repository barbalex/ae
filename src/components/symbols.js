'use strict'

import React from 'react'
import ReplicatingToAe from './replicatingToAe.js'
import Email from './email.js'

export default React.createClass({
  displayName: 'Symbols',

  propTypes: {
    email: React.PropTypes.string,
    replicatingToAe: React.PropTypes.bool
  },

  render () {
    const { email, replicatingToAe } = this.props

    return (
      <div id='symbols'>
        <div className='pull-right'>
          {replicatingToAe ? <ReplicatingToAe /> : null}
          <Email email={email} />
        </div>
      </div>
    )
  }
})
