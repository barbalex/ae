'use strict'

import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  text: {
    textDecoration: 'underline',
    paddingLeft: 5,
    color: 'red',
    fontWeight: 500,
    cursor: 'progress'
  }
})

const GroupsLoading = ({ groupsLoadingObjects }) =>
  <OverlayTrigger
    placement="left"
    overlay={
      <Tooltip
        id="groupsLoadingTooltip"
        bsStyle="info"
      >
        Bitte Geduld: Die App kann zeitweise einfrieren!
      </Tooltip>
    }
  >
    <p
      className={css(styles.text)}
    >
      {groupsLoadingObjects.length > 1 ? 'Lade Gruppen...' : 'Lade Gruppe...'}
    </p>
  </OverlayTrigger>

GroupsLoading.displayName = 'GroupsLoading'

GroupsLoading.propTypes = {
  groupsLoadingObjects: React.PropTypes.array
}

export default GroupsLoading
