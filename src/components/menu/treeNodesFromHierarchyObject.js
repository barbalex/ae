'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import isGuid from '../../modules/isGuid.js'
import getLrObjectFromPath from '../../modules/getLrObjectFromPath.js'

const Nodes = React.createClass({
  displayName: 'TreeLowerLevel',

  propTypes: {
    hierarchy: React.PropTypes.object,  // = hierarchy-object OF THIS LEVEL
    activeKey: React.PropTypes.string,
    gruppe: React.PropTypes.string,
    guid: React.PropTypes.string,
    path: React.PropTypes.array,
    level: React.PropTypes.number
  },

  getInitialState () {
    // console.log('treeNodesFromHierarchyObject.js, getInitialState: props', this.props)
    const { hierarchy, guid, path, level } = this.props
    // if this level is the guid, it's name needs to be gotten
    let activeKey = path[level - 1] || null
    if (isGuid(activeKey)) {
      activeKey = _.findKey(hierarchy, function (value) {
        return value === guid
      })
    }

    return {
      activeKey: activeKey,
      path: path
    }
  },

  onClickNode (params, event) {
    event.stopPropagation()
    console.log('click')

    const { activeKey } = this.state
    let { path } = this.state
    const { hierarchy, gruppe } = this.props
    const { key, guid, level } = params
    let newActiveKey
    console.log('treeNodesFromHierarchyObject.js, gruppe', gruppe)

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

    let activeObjectStoreValue = this.state.guid === guid ? null : guid
    if (gruppe === 'Lebensräume') {
      // find guid for path
      const lrObject = getLrObjectFromPath(path)
      if (lrObject && lrObject._id) activeObjectStoreValue = lrObject._id
    }
    app.Actions.loadActiveObjectStore(activeObjectStoreValue)
    app.Actions.loadPathStore(path)
  },

  render () {
    // console.log('treeNodesFromHierarchyObject.js, render: state', this.state)
    // console.log('treeNodesFromHierarchyObject.js, render: props', this.props)
    let nodes
    const that = this
    const { hierarchy, gruppe, guid, level } = this.props
    const { activeKey, path } = this.state

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
            <div className={keyIsActive ? 'active' : null}>{key.replace('&#39;', '\'')}</div>
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
