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
          <div className='symbol-div'>
            <Email email={email} />
          </div>
          <div className='symbol-div'>
            {showReplicatingFromAe ? <ReplicatingFromAe replicatingFromAe={replicatingFromAe} replicatingFromAeTime={replicatingFromAeTime} /> : null}
          </div>
          <div className='symbol-div'>
            {showReplicatingToAe ? <ReplicatingToAe replicatingToAe={replicatingToAe} replicatingToAeTime={replicatingToAeTime} /> : null}
          </div>
          <div className='symbol-div'>
            {pcsQuerying ? <PcsQuerying /> : null}
          </div>
          <div className='symbol-div'>
            {rcsQuerying ? <RcsQuerying /> : null}
          </div>
        </div>
      </div>
    )
  }
})
