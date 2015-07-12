'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import getObjectFromPath from '../../modules/getObjectFromPath.js'

const Nodes = React.createClass({
  displayName: 'TreeLowerLevel',

  propTypes: {
    hierarchy: React.PropTypes.array,  // = hierarchy objects OF THIS LEVEL
    activeKey: React.PropTypes.string,
    gruppe: React.PropTypes.string,
    object: React.PropTypes.object,
    path: React.PropTypes.array,
    level: React.PropTypes.number
  },

  getInitialState () {
    // console.log('treeNodesFromHierarchyObject.js, getInitialState: props', this.props)
    const { path, level, gruppe, object } = this.props
    // if this level is the guid, it's name needs to be gotten
    const activeKey = path[level - 1] || null

    return {
      gruppe: gruppe,
      activeKey: activeKey,
      path: path
    }
  },

  onClickNode (params, event) {
    event.stopPropagation()

    const { activeKey } = this.state
    let { path } = this.state
    // const { hierarchy } = this.props
    const { hO, level, gruppe } = params
    let newActiveKey

    console.log('treeNodesFromHierarchyObject.js, onClickNode, hO', hO)
    console.log('treeNodesFromHierarchyObject.js, onClickNode, hO.GUID', hO.GUID)

    // get level clicked
    const levelClicked = level
    const activeKeyClicked = hO.Name === activeKey
    const lastLevelClicked = levelClicked === this.state.path.length

    if (activeKeyClicked) {
      // the active hO of this level was clicked again > deactivate it
      newActiveKey = null
      path.pop()
    } else {
      // a different hO of the last or lower level was clicked
      // if not the last level clicked: remove all path elements above the level clicked
      const end = lastLevelClicked ? path.length - 1 : levelClicked
      path = _.slice(path, 0, end)
      const newPathElement = hO.Name
      path.push(newPathElement)
      newActiveKey = hO.Name
    }

    this.setState({
      gruppe: gruppe,
      activeKey: newActiveKey,
      path: path
    })

    app.Actions.loadActiveObjectStore(hO.GUID)
    app.Actions.loadPathStore(path)
  },

  render () {
    // console.log('treeNodesFromHierarchyObject.js, render: state', this.state)
    // console.log('treeNodesFromHierarchyObject.js, render: props', this.props)
    let nodes
    const that = this
    const { hierarchy, object, level } = this.props
    const { activeKey, path, gruppe } = this.state

    console.log('treeNodesFromHierarchyObject.js, render: object', object)

    nodes = _.chain(hierarchy)
      // .sort()
      .map(function (hO) {
        const keyIsActive = hO.Name === activeKey
        const keyIsObject = !!hO.GUID
        const keyIsObjectShown = object !== undefined && hO.GUID && object._id === hO.GUID
        const glyph = keyIsActive ? (keyIsObjectShown ? 'forward' : 'triangle-bottom') : (hO.children && hO.children.length > 0 ? 'triangle-right' : 'minus')
        const onClickNode = that.onClickNode.bind(that, {'hO': hO, 'level': level, 'gruppe': gruppe})

        return (
          <li level={level} hO={hO} onClick={onClickNode}>
            <Glyphicon glyph={glyph} onClick={onClickNode}/>
            <div className={keyIsActive ? 'active' : null}>{hO.Name.replace('&#39;', '\'')}</div>
            {(hO.Name === activeKey && hO.children) ? <Nodes hierarchy={hO.children} gruppe={gruppe} object={object} level={level + 1} path={path}/> : null}
          </li>
        )
      })
      .value()

    return (
      <ul className={'level' + level}>
        {nodes}
      </ul>
    )
  }
})

export default Nodes
