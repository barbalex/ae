'use strict'

import React from 'react'
import ReplicatingToAe from './replicatingToAe.js'
import Email from './email.js'

export default React.createClass({
  displayName: 'Symbols',

  propTypes: {
    email: React.PropTypes.string,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string
  },

  render () {
    const { email, replicatingToAe, replicatingToAeTime } = this.props
    const showReplicatingToAe = replicatingToAe !== null

    return (
      <div id='symbols'>
        <div className='pull-right'>
          {showReplicatingToAe ? <ReplicatingToAe replicatingToAe={replicatingToAe} replicatingToAeTime={replicatingToAeTime} /> : null}
          <Email email={email} />
        </div>
      </div>
    )
  }
})
