import React from 'react'
import { debounce } from 'lodash'
import { StyleSheet, css } from 'aphrodite'
import { Scrollbars } from 'react-custom-scrollbars'
import Nodes from './TreeNodesCt.js'
import buildNodes from '../../../modules/buildNodes'

export default React.createClass({
  displayName: 'Tree',

  propTypes: {
    nodes: React.PropTypes.array,
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
    const { nodes } = this.props
    console.log('Tree.js, nodes passed in props:', nodes)
    const nodesBuild = buildNodes(nodes)
    console.log('Tree.js, nodes after building:', nodesBuild)
    const { windowHeight, windowWidth } = this.state

    // console.log('Tree.js, render, nodes:', nodes)
    // console.log('Tree.js, render, nodes.children:', nodes.children)
    // console.log('Tree.js, render, idPath:', idPath)

    // calculate max height of tree
    let maxHeight = windowHeight - 323                      // initial value on mobile
    if (windowWidth > 1000) maxHeight = windowHeight - 110  // initial value on desktop
    const treeStyle = { maxHeight }

    // there needs to be enough height below the tree
    // to swipe up the properties
    // > set max-height
    const styles = StyleSheet.create({
      rootDiv: {
      },
      tree: {
        marginBottom: 5,
        paddingRight: 10,
        float: 'left',
        clear: 'both',
      }
    })

    return (
      <div
        id="tree"
        className={css(styles.tree)}
        style={treeStyle}
      >
        <Scrollbars
          style={{
            width: '100%',
          }}
          autoHide
          autoHeight
          autoHeightMax={maxHeight}
        >
          {
            nodesBuild &&
            nodesBuild.children &&
            <Nodes
              nodes={nodesBuild.children}
            />
          }
        </Scrollbars>
      </div>
    )
  }
})
