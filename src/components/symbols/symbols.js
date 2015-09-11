'use strict'

import React from 'react'
import ReplicatingToAe from './replicatingToAe.js'
import ReplicatingFromAe from './replicatingFromAe.js'
import Email from './email.js'
import PcsQuerying from './pcsQuerying.js'
import RcsQuerying from './rcsQuerying.js'

export default React.createClass({
  displayName: 'Symbols',

  propTypes: {
    pcsQuerying: React.PropTypes.bool,
    rcsQuerying: React.PropTypes.bool,
    email: React.PropTypes.string,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    replicatingFromAe: React.PropTypes.string,
    replicatingFromAeTime: React.PropTypes.string
  },

  render () {
    const { email, replicatingToAe, replicatingToAeTime, replicatingFromAe, replicatingFromAeTime, pcsQuerying, rcsQuerying } = this.props
    const showReplicatingToAe = replicatingToAe !== null
    const showReplicatingFromAe = replicatingFromAe !== null

    return (
      <div id='symbols'>
        <div className='pull-right'>
          <Email email={email} />
          {showReplicatingToAe ? <ReplicatingToAe replicatingToAe={replicatingToAe} replicatingToAeTime={replicatingToAeTime} /> : null}
          {showReplicatingFromAe ? <ReplicatingFromAe replicatingFromAe={replicatingFromAe} replicatingFromAeTime={replicatingFromAeTime} /> : null}
          {pcsQuerying ? <PcsQuerying /> : null}
          {rcsQuerying ? <RcsQuerying /> : null}
        </div>
      </div>
    )
  }
})
