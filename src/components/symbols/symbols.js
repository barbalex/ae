'use strict'

import React from 'react'
import ReplicatingToAe from './ReplicatingToAe.js'
import ReplicatingFromAe from './ReplicatingFromAe.js'
import Email from './Email.js'
import GroupsLoading from './GroupsLoading.js'
import TcsQuerying from './TcsQuerying.js'
import PcsQuerying from './PcsQuerying.js'
import RcsQuerying from './RcsQuerying.js'
import FieldsQuerying from './FieldsQuerying.js'
import RebuildingRedundantData from './RebuildingRedundantData.js'

const Symbols = ({
  email,
  replicatingToAe,
  replicatingToAeTime,
  replicatingFromAe,
  replicatingFromAeTime,
  groupsLoadingObjects,
  tcsQuerying,
  pcsQuerying,
  rcsQuerying,
  fieldsQuerying,
  rebuildingRedundantData
}) => {
  const showReplicatingToAe = replicatingToAe !== null
  const showReplicatingFromAe = replicatingFromAe !== null
  const showGroupsLoading = groupsLoadingObjects.length > 0
  const showRebuildingRedundantData = rebuildingRedundantData !== null

  return (
    <div id="symbols">
      <div className="pull-right">
        <div className="symbol-div">
          <Email email={email} />
        </div>
        <div className="symbol-div">
          {
            showReplicatingFromAe &&
            <ReplicatingFromAe
              replicatingFromAe={replicatingFromAe}
              replicatingFromAeTime={replicatingFromAeTime}
            />
          }
        </div>
        <div className="symbol-div">
          {
            showReplicatingToAe &&
            <ReplicatingToAe
              replicatingToAe={replicatingToAe}
              replicatingToAeTime={replicatingToAeTime}
            />
          }
        </div>
        <div className="symbol-div">
          {
            tcsQuerying &&
            <TcsQuerying />
          }
        </div>
        <div className="symbol-div">
          {
            pcsQuerying &&
            <PcsQuerying />
          }
        </div>
        <div className="symbol-div">
          {
            rcsQuerying &&
            <RcsQuerying />
          }
        </div>
        <div className="symbol-div">
          {
            fieldsQuerying &&
            <FieldsQuerying />
          }
        </div>
        <div className="symbol-div">
          {
            showGroupsLoading &&
            <GroupsLoading
              groupsLoadingObjects={groupsLoadingObjects}
            />
          }
        </div>
        <div className="symbol-div">
          {
            showRebuildingRedundantData &&
            <RebuildingRedundantData
              rebuildingRedundantData={rebuildingRedundantData}
            />
          }
        </div>
      </div>
    </div>
  )
}

Symbols.displayName = 'Symbols'

Symbols.propTypes = {
  groupsLoadingObjects: React.PropTypes.array,
  tcsQuerying: React.PropTypes.bool,
  pcsQuerying: React.PropTypes.bool,
  rcsQuerying: React.PropTypes.bool,
  fieldsQuerying: React.PropTypes.bool,
  email: React.PropTypes.string,
  replicatingToAe: React.PropTypes.string,
  replicatingToAeTime: React.PropTypes.string,
  replicatingFromAe: React.PropTypes.string,
  replicatingFromAeTime: React.PropTypes.string,
  rebuildingRedundantData: React.PropTypes.string
}

export default Symbols
