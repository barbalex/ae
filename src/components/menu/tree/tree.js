'use strict'

import React from 'react'
import $ from 'jquery'
import Nodes from './treeNodes.js'
import LoadingMessage from './loadingMessage.js'

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
    const treeStyle = {
      maxHeight: treeMaxHeight
    }

    const loadingMessages = groupsLoadingObjects.map((groupLoadingObject, index) => <LoadingMessage key={index} groupLoadingObject={groupLoadingObject} />)

    return (
      <div>
        <div id='tree' style={treeStyle}>
          {hierarchy ?
            <div>
              <Nodes
                hierarchy={hierarchy}
                object={object}
                path={path} />
            </div>
            : null
          }
        </div>
        {loading ?
          loadingMessages
          : null
        }
      </div>
    )
  }
})
