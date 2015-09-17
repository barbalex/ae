'use strict'

import React from 'react'
import ReplicatingToAe from './replicatingToAe.js'
import ReplicatingFromAe from './replicatingFromAe.js'
import Email from './email.js'
import GroupsLoading from './groupsLoading.js'
import PcsQuerying from './pcsQuerying.js'
import RcsQuerying from './rcsQuerying.js'
import FieldsQuerying from './fieldsQuerying.js'

export default React.createClass({
  displayName: 'Symbols',

  propTypes: {
    groupsLoadingObjects: React.PropTypes.array,
    pcsQuerying: React.PropTypes.bool,
    rcsQuerying: React.PropTypes.bool,
    fieldsQuerying: React.PropTypes.bool,
    email: React.PropTypes.string,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    replicatingFromAe: React.PropTypes.string,
    replicatingFromAeTime: React.PropTypes.string
  },

  render () {
    const { email, replicatingToAe, replicatingToAeTime, replicatingFromAe, replicatingFromAeTime, groupsLoadingObjects, pcsQuerying, rcsQuerying, fieldsQuerying } = this.props
    const showReplicatingToAe = replicatingToAe !== null
    const showReplicatingFromAe = replicatingFromAe !== null
    const showGroupsLoading = groupsLoadingObjects.length > 0

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
          <div className='symbol-div'>
            {fieldsQuerying ? <FieldsQuerying /> : null}
          </div>
          <div className='symbol-div'>
            {showGroupsLoading ?
              <GroupsLoading
                groupsLoadingObjects={groupsLoadingObjects} />
              : null
            }
          </div>
        </div>
      </div>
    )
  }
})
