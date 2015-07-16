'use strict'

import React from 'react'
import _ from 'lodash'
import Nodes from './treeNodesFromHierarchyObject.js'

export default React.createClass({
  displayName: 'TreeLevel1',

  propTypes: {
    hierarchy: React.PropTypes.array,
    gruppe: React.PropTypes.string,
    groupsLoading: React.PropTypes.array,
    object: React.PropTypes.object,
    path: React.PropTypes.array
  },

  render () {
    const { hierarchy, gruppe, object, path, groupsLoading } = this.props
    const loading = groupsLoading && groupsLoading.length > 0

    const tree = (
      <div>
        <Nodes hierarchy={hierarchy} gruppe={gruppe} object={object} path={path} />
      </div>
    )

    // const loadingMessage = <p>Lade {loadingGruppe}...</p>
    const loadingMessage = _.map(groupsLoading, function (groupLoading) {
      // Macromycetes shall appear as Pilze
      const groupName = groupLoading.replace('Macromycetes', 'Pilze')
      return <p key={groupName}>Lade {groupName}...</p>
    })

    return (
      <div>
        <div id='tree' className='baum'>
          {hierarchy ? tree : ''}
        </div>
        {loading ? loadingMessage : ''}
      </div>
    )
  }
})
