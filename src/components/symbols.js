'use strict'

import React from 'react'
import ReplicatingToAe from './replicatingToAe.js'
import Email from './email.js'

export default React.createClass({
  displayName: 'Symbols',

  propTypes: {
    email: React.PropTypes.string,
    replicatingToAe: React.PropTypes.string
  },

  render () {
    const { email, replicatingToAe } = this.props

    return (
      <div id='symbols'>
        <div className='pull-right'>
          {replicatingToAe ? <ReplicatingToAe replicatingToAe={replicatingToAe} /> : null}
          <Email email={email} />
        </div>
      </div>
    )
  }
})
