'use strict'

import React from 'react'
import ReplicatingToAe from './replicatingToAe.js'
import ReplicatingFromAe from './replicatingFromAe.js'
import Email from './email.js'

export default React.createClass({
  displayName: 'Symbols',

  propTypes: {
    email: React.PropTypes.string,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    replicatingFromAe: React.PropTypes.string,
    replicatingFromAeTime: React.PropTypes.string
  },

  render () {
    const { email, replicatingToAe, replicatingToAeTime, replicatingFromAe, replicatingFromAeTime } = this.props
    const showReplicatingToAe = replicatingToAe !== null
    const showReplicatingFromAe = replicatingFromAe !== null

    return (
      <div id='symbols'>
        <div className='pull-right'>
          {showReplicatingFromAe ? <ReplicatingFromAe replicatingFromAe={replicatingFromAe} replicatingFromAeTime={replicatingFromAeTime} /> : null}
          {showReplicatingToAe ? <ReplicatingToAe replicatingToAe={replicatingToAe} replicatingToAeTime={replicatingToAeTime} /> : null}
          <Email email={email} />
        </div>
      </div>
    )
  }
})
