'use strict'

import React from 'react'
import { debounce } from 'lodash'
import { StyleSheet, css } from 'aphrodite'
import Nodes from './treeNodes.js'
import LoadingMessage from './loadingMessage.js'

// there needs to be enough height below the tree
// to swipe up the properties
// > set max-height
const styles = StyleSheet.create({
  treeRootDiv: {
    float: 'left',
    clear: 'both',
    width: '100%',
    marginBottom: 5
  },
  tree: {
    maxHeight: 'calc(100vh - 302px)',
    overflow: 'auto',
    overflowX: 'hidden',
    paddingRight: 15
  }
})

export default React.createClass({
  displayName: 'TreeLevel1',

  propTypes: {
    hierarchy: React.PropTypes.array,
    groupsLoadingObjects: React.PropTypes.array,
    allGroupsLoaded: React.PropTypes.bool,
    object: React.PropTypes.object,
    path: React.PropTypes.array,
    windowHeight: React.PropTypes.number,
    windowWidth: React.PropTypes.number
  },

  getInitialState() {
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    return { windowHeight, windowWidth }
  },

  componentDidMount() {
    window.addEventListener('resize', debounce(this.onResize, 150))
  },

  componentWillUnmount() {
    window.removeEventListener('resize')
  },

  onResize() {
    // calculate max height of tree
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    this.setState({ windowHeight, windowWidth })
  },

  render() {
    const {
      hierarchy,
      object,
      path,
      groupsLoadingObjects,
      allGroupsLoaded
    } = this.props
    const { windowHeight, windowWidth } = this.state
    const loading = groupsLoadingObjects && groupsLoadingObjects.length > 0

    // calculate max height of tree
    const groupsLoadingHeight = 22 * (groupsLoadingObjects.length)
    let maxHeight = windowHeight - 302                      // initial value on mobile
    if (windowWidth > 1000) maxHeight = windowHeight - 160  // initial value on desktop
    maxHeight -= groupsLoadingHeight                        // correction if groups are loading
    if (allGroupsLoaded) maxHeight += 59                    // correction if all groups are loaded
    const treeStyle = { maxHeight }

    const loadingMessages = groupsLoadingObjects.map((groupLoadingObject, index) =>
      <LoadingMessage
        key={index}
        groupLoadingObject={groupLoadingObject}
      />
    )

    return (
      <div className={css(styles.treeRootDiv)}>
        <div
          id="tree"
          style={treeStyle}
          className={css(styles.tree)}
        >
          {
            hierarchy &&
            <div>
              <Nodes
                hierarchy={hierarchy}
                object={object}
                path={path}
              />
            </div>
          }
        </div>
        {
          loading &&
          loadingMessages
        }
      </div>
    )
  }
})
