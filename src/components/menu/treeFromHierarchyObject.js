'use strict'

import React from 'react'
import _ from 'lodash'
import $ from 'jquery'
import Nodes from './treeNodesFromHierarchyObject.js'

export default React.createClass({
  displayName: 'TreeLevel1',

  propTypes: {
    hierarchy: React.PropTypes.array,
    gruppe: React.PropTypes.string,
    groupsLoading: React.PropTypes.array,
    allGroupsLoaded: React.PropTypes.bool,
    object: React.PropTypes.object,
    path: React.PropTypes.array
  },

  render () {
    const { hierarchy, gruppe, object, path, groupsLoading, allGroupsLoaded } = this.props
    const loading = groupsLoading && groupsLoading.length > 0

    // calculate max height of tree
    const windowHeight = $(window).height()
    const windowWidth = $(window).width()
    let treeMaxHeight = windowHeight - 302                      // initial value on mobile
    if (windowWidth > 1000) treeMaxHeight = windowHeight - 169  // initial value on desktop
    const groupsLoadingHeight = 22 * (groupsLoading.length)
    treeMaxHeight = treeMaxHeight - groupsLoadingHeight         // correction if groups are loading
    if (allGroupsLoaded) treeMaxHeight = treeMaxHeight + 59     // correction if all groups are loaded

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
        <div id='tree' style={{maxHeight: treeMaxHeight + 'px'}} className='baum'>
          {hierarchy ? tree : ''}
        </div>
        {loading ? loadingMessage : ''}
      </div>
    )
  }
})
