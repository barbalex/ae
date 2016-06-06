'use strict'

import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import ReplicatingToAe from './ReplicatingToAe.js'
import ReplicatingFromAe from './ReplicatingFromAe.js'
import Email from './Email.js'
import GroupsLoading from './GroupsLoading.js'
import TcsQuerying from './TcsQuerying.js'
import PcsQuerying from './PcsQuerying.js'
import RcsQuerying from './RcsQuerying.js'
import FieldsQuerying from './FieldsQuerying.js'
import RebuildingRedundantData from './RebuildingRedundantData.js'

const styles = StyleSheet.create({
  rootDiv: {
    position: 'absolute',
    right: 8,
    marginTop: 3,
    zIndex: 1
  },
  symbolDiv: {
    float: 'right'
  }
})

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
    <div id="symbols" className={css(styles.rootDiv)}>
      <div className="pull-right">
        <div className={css(styles.symbolDiv)}>
          <Email email={email} />
        </div>
        <div className={css(styles.symbolDiv)}>
          {
            showReplicatingFromAe &&
            <ReplicatingFromAe
              replicatingFromAe={replicatingFromAe}
              replicatingFromAeTime={replicatingFromAeTime}
            />
          }
        </div>
        <div className={css(styles.symbolDiv)}>
          {
            showReplicatingToAe &&
            <ReplicatingToAe
              replicatingToAe={replicatingToAe}
              replicatingToAeTime={replicatingToAeTime}
            />
          }
        </div>
        <div className={css(styles.symbolDiv)}>
          {
            tcsQuerying &&
            <TcsQuerying />
          }
        </div>
        <div className={css(styles.symbolDiv)}>
          {
            pcsQuerying &&
            <PcsQuerying />
          }
        </div>
        <div className={css(styles.symbolDiv)}>
          {
            rcsQuerying &&
            <RcsQuerying />
          }
        </div>
        <div className={css(styles.symbolDiv)}>
          {
            fieldsQuerying &&
            <FieldsQuerying />
          }
        </div>
        <div className={css(styles.symbolDiv)}>
          {
            showGroupsLoading &&
            <GroupsLoading
              groupsLoadingObjects={groupsLoadingObjects}
            />
          }
        </div>
        <div className={css(styles.symbolDiv)}>
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
