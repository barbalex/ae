import React from 'react'
import { debounce } from 'lodash'
import { StyleSheet, css } from 'aphrodite'
import Nodes from './TreeNodes.js'

export default React.createClass({
  displayName: 'TreeLevel1',

  propTypes: {
    nodes: React.PropTypes.object,
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
      nodes,
      object,
      path,
    } = this.props
    const { windowHeight, windowWidth } = this.state

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
        float: 'left',
        clear: 'both',
        width: '100%',
        marginBottom: 5,
        overflow: 'auto',
        overflowX: 'hidden',
        paddingRight: 15,
        maxHeight
      }
    })

    return (
      <div
        id="tree"
        className={css(styles.tree)}
        style={treeStyle}
      >
        {
          nodes &&
          <Nodes
            nodes={nodes.children}
            object={object}
            path={path}
          />
        }
      </div>
    )
  }
})
