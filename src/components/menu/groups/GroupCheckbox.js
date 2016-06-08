import app from 'ampersand-app'
import React from 'react'
import { Checkbox } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  checkbox: {
    marginTop: '9px'
  },
  label: {
    marginLeft: '-5px'
  }
})

const Group = ({ group }) =>
  <Checkbox
    className={css(styles.checkbox)}
    checked={false}
    onClick={() =>
      app.Actions.loadObject(group)
    }
  >
    <span className={css(styles.label)}>
      {group.replace('Macromycetes', 'Pilze')}
    </span>
  </Checkbox>

Group.displayName = 'Group'

Group.propTypes = {
  group: React.PropTypes.string
}

export default Group
