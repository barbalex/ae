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
    <div id="groups">
      <div id="groupCheckboxesTitle">
        Gruppen laden:
      </div>
      <div id="groupCheckboxes">
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
