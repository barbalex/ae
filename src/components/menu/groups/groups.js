'use strict'

import React from 'react'
import { difference } from 'lodash'
import { StyleSheet, css } from 'aphrodite'
import GroupCheckbox from './groupCheckbox.js'
import getGruppen from '../../../modules/gruppen.js'

const gruppen = getGruppen()

const styles = StyleSheet.create({
  groupsDiv: {
    float: 'left',
    clear: 'both',
    width: '100%',
    padding: '5px 10px',
    border: '1px solid transparent',
    borderRadius: '3px',
    backgroundColor: 'rgb(255, 255, 255)',
    borderColor: 'rgb(204, 204, 204)',
    color: '#333',
    margin: 0,
    marginBottom: 5
  },
  labelDiv: {
    height: 12
  },
  groupCheckboxesDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    height: 30
  }
})

const Groups = ({ groupsLoadedOrLoading }) => {
  const groupsNotLoaded = difference(gruppen, groupsLoadedOrLoading)
  const groupCheckboxes = groupsNotLoaded.map((group, index) =>
    <GroupCheckbox
      key={index}
      group={group}
    />
  )

  return (
    <div
      className={css(styles.groupsDiv)}
    >
      <div className={css(styles.labelDiv)}>
        Gruppen laden:
      </div>
      <div
        className={css(styles.groupCheckboxesDiv)}
      >
        {groupCheckboxes}
      </div>
    </div>
  )
}

Groups.displayName = 'Groups'

Groups.propTypes = {
  groupsLoadedOrLoading: React.PropTypes.array
}

export default Groups
