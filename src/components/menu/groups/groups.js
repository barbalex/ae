'use strict'

import React from 'react'
import { difference } from 'lodash'
import GroupCheckbox from './groupCheckbox.js'
import getGruppen from '../../../modules/gruppen.js'

const gruppen = getGruppen()

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
      style={{
        padding: '5px 10px',
        border: '1px solid transparent',
        borderRadius: '3px',
        backgroundColor: 'rgb(255, 255, 255)',
        borderColor: 'rgb(204, 204, 204)',
        color: '#333',
        margin: 0,
        marginBottom: 5
      }}
    >
      <div style={{ height: 12 }}>
        Gruppen laden:
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: 30
        }}
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
