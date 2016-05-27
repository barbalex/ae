'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Checkbox } from 'react-bootstrap'

const Group = ({ group }) =>
  <Checkbox
    style={{
      marginTop: '10px',
      marginLeft: '-4px'
    }}
    checked={false}
    onClick={() =>
      app.Actions.loadObject(group)
    }
  >
    {group.replace('Macromycetes', 'Pilze')}
  </Checkbox>

Group.displayName = 'Group'

Group.propTypes = {
  group: React.PropTypes.string
}

export default Group
