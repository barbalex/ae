'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Input } from 'react-bootstrap'

const Group = ({ group }) => {
  const label = group.replace('Macromycetes', 'Pilze')
  return (
    <Input
      type="checkbox"
      label={label}
      onClick={() => app.Actions.loadObject(group)}
    />
  )
}

Group.displayName = 'Group'

Group.propTypes = {
  group: React.PropTypes.string
}

export default Group
