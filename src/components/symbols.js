'use strict'

import React from 'react'
import ReplicatingToAe from './replicatingToAe.js'
import ReplicatingFromAe from './replicatingFromAe.js'
import Email from './email.js'
import PcsQuerying from './pcsQuerying.js'

export default React.createClass({
  displayName: 'Symbols',

  propTypes: {
    pcsQuerying: React.PropTypes.bool,
    email: React.PropTypes.string,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    replicatingFromAe: React.PropTypes.string,
    replicatingFromAeTime: React.PropTypes.string
  },

  render () {
    const { email, replicatingToAe, replicatingToAeTime, replicatingFromAe, replicatingFromAeTime, pcsQuerying } = this.props
    const showReplicatingToAe = replicatingToAe !== null
    const showReplicatingFromAe = replicatingFromAe !== null

    return (
      <div id='symbols'>
        <div className='pull-right'>
          <Email email={email} />
          {showReplicatingToAe ? <ReplicatingToAe replicatingToAe={replicatingToAe} replicatingToAeTime={replicatingToAeTime} /> : null}
          {showReplicatingFromAe ? <ReplicatingFromAe replicatingFromAe={replicatingFromAe} replicatingFromAeTime={replicatingFromAeTime} /> : null}
          {pcsQuerying ? <PcsQuerying /> : null}
        </div>
      </div>
    )
  }
})
