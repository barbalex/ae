'use strict'

import React from 'react'
import { Button } from 'react-bootstrap'
import _ from 'lodash'

export default React.createClass({
  displayName: 'GroupsToExport',

  propTypes: {
    taxonomienZusammenfassen: React.PropTypes.array,
    onChangeTaxonomienZusammenfassen: React.PropTypes.func
  },

  onChangeGroup (group, event) {
    const { onChangeGroupsToExport } = this.props
    const checked = event.target.checked
    onChangeGroupsToExport(group, checked)
  },

  render () {
    const { taxonomienZusammenfassen } = this.props

    const groupCheckboxes = groupsLoadedOrLoading.map((group) => {
      const checked = _.includes(groupsToExport, group)
      return <Input type='checkbox' label={group} checked={checked} onChange={this.onChangeGroup.bind(this, group)} />
    })

    return (
      <div className='checkbox'>
        {groupCheckboxes}
      </div>
    )
  }

})
