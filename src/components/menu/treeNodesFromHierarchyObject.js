'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import setTreeHeight from '../../modules/setTreeHeight.js'
import isGuid from '../../modules/isGuid.js'

const Nodes = React.createClass({
  displayName: 'TreeLowerLevel',

  propTypes: {
    hierarchy: React.PropTypes.node,  // = hierarchy-object OF THIS LEVEL
    activeKey: React.PropTypes.string,
    gruppe: React.PropTypes.string,
    guid: React.PropTypes.string,
    path: React.PropTypes.array,
    level: React.PropTypes.number
  },

  getInitialState () {
    const { hierarchy, gruppe, guid, path, level } = this.props
    // if this level is the guid, it's name needs to be gotten
    let activeKey = path[level - 1] || null
    if (isGuid(activeKey)) {
      activeKey = _.findKey(hierarchy, function (value) {
        return value === guid
      })
    }

    const state = {
      hierarchy: hierarchy,
      activeKey: activeKey,
      gruppe: gruppe,
      guid: guid,
      path: path,
      level: level
    }

    console.log('treeNodesFromHierarchyObject.js getInitialState: state', state)

    return state
  },

  componentDidMount () {
    setTreeHeight()
  },

  onClickNode (params, event) {
    event.stopPropagation()

    const { hierarchy, activeKey} = this.state
    let newActiveKey
    let path = this.state.path
    const { key, guid, level } = params

    // get level clicked
    const levelClicked = level
    const activeKeyClicked = key === activeKey
    const lastLevelClicked = levelClicked === this.state.path.length

    if (activeKeyClicked) {
      // the active key of this level was clicked again > deactivate it
      newActiveKey = null
      path.pop()
    } else {
      // a different key of the last or lower level was clicked
      // if not the last level clicked: remove all path elements above the level clicked
      const end = lastLevelClicked ? path.length - 1 : levelClicked
      path = _.slice(path, 0, end)
      const newPathElement = typeof hierarchy[key] === 'object' ? key : hierarchy[key]
      path.push(newPathElement)
      newActiveKey = key
    }

    this.setState({
      activeKey: newActiveKey,
      path: path
    })

    const activeObjectStoreValue = this.state.guid === guid ? null : guid
    app.Actions.loadActiveObjectStore(activeObjectStoreValue)
    app.Actions.loadPathStore(path)
  },

  render () {
    // console.log('treeNodesFromHierarchyObject.js, render: state', this.state)
    let nodes
    const that = this
    const { hierarchy, activeKey, path, gruppe, guid, level } = this.state

    nodes = _.chain(hierarchy)
      .keys()
      .sort()
      .map(function (key) {
        const keyIsActive = key === activeKey || hierarchy[key] === activeKey
        const keyIsObject = typeof hierarchy[key] === 'string'
        const glyph = keyIsActive ? (keyIsObject ? 'forward' : 'triangle-bottom') : (keyIsObject ? 'minus' : 'triangle-right')
        const onClickNode = that.onClickNode.bind(that, {'key': key, 'guid': (keyIsObject ? hierarchy[key] : null), 'level': level})

        return (
          <li level={level} key={key} onClick={onClickNode}>
            <Glyphicon glyph={glyph} onClick={onClickNode}/>
            <div className={keyIsActive ? 'active' : null}>{key}</div>
            {(key === activeKey && !keyIsObject) ? <Nodes hierarchy={hierarchy[key]} gruppe={gruppe} guid={guid} level={level + 1} path={path}/> : null}
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
