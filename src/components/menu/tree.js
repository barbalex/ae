'use strict'

import React from 'react'
import { ProgressBar } from 'react-bootstrap'
import _ from 'lodash'
import $ from 'jquery'
import Nodes from './treeNodes.js'

export default React.createClass({
  displayName: 'TreeLevel1',

  propTypes: {
    hierarchy: React.PropTypes.array,
    groupsLoadingObjects: React.PropTypes.array,
    allGroupsLoaded: React.PropTypes.bool,
    object: React.PropTypes.object,
    path: React.PropTypes.array
  },

  render () {
    const { hierarchy, object, path, groupsLoadingObjects, allGroupsLoaded } = this.props
    const loading = groupsLoadingObjects && groupsLoadingObjects.length > 0

    // calculate max height of tree
    const windowHeight = $(window).height()
    const windowWidth = $(window).width()
    const groupsLoadingHeight = 22 * (groupsLoadingObjects.length)
    let treeMaxHeight = windowHeight - 302                      // initial value on mobile
    if (windowWidth > 1000) treeMaxHeight = windowHeight - 169  // initial value on desktop
    treeMaxHeight -= groupsLoadingHeight                        // correction if groups are loading
    if (allGroupsLoaded) treeMaxHeight += 59                    // correction if all groups are loaded

    const tree = (
      <div>
        <Nodes hierarchy={hierarchy} object={object} path={path} />
      </div>
    )

    // sort loading objects by name
    const loadingMessage = groupsLoadingObjects.map((groupLoadingObject) => {
      let { message, group, progressPercent } = groupLoadingObject
      // Macromycetes shall appear as Pilze
      message = message.replace('Macromycetes', 'Pilze')
      const groupName = group.toLowerCase()
      if (progressPercent || progressPercent === 0) return <ProgressBar bsStyle='success' key={groupName} now={progressPercent} label={message} />
      return <p key={groupName}>{message}</p>
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
