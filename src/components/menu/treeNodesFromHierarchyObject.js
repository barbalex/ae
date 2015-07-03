'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import { Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import setTreeHeight from '../../modules/setTreeHeight.js'
import isGuid from '../../modules/isGuid.js'

const Nodes = React.createClass({
  displayName: 'TreeLowerLevel',

  // ListenerMixin provides the listenTo method for the React component,
  // that works much like the one found in the Reflux's stores,
  // and handles the listeners during mount and unmount for you.
  // You also get the same listenToMany method as the store has.
  mixins: [ListenerMixin, State, Navigation],

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

    console.log('treeNodesFromHierarchyObject.js onClickNode: params', params)
    console.log('treeNodesFromHierarchyObject.js onClickNode: this.state before', this.state)

    const { hierarchy, activeKey} = this.state
    let newActiveKey
    let path = this.state.path
    const { key, guid, level } = params

    // TODO: REMOVE FROM STATE WHAT IS NOT CHANGED IN COMPONENT

    // get level clicked
    const levelClicked = level
    const activeKeyClicked = key === activeKey
    const lastLevelClicked = levelClicked === this.state.path.length

    console.log('treeNodesFromHierarchyObject.js onClickNode: levelClicked', levelClicked)
    console.log('treeNodesFromHierarchyObject.js onClickNode: activeKeyClicked', activeKeyClicked)
    console.log('treeNodesFromHierarchyObject.js onClickNode: lastLevelClicked', lastLevelClicked)
    console.log('treeNodesFromHierarchyObject.js onClickNode: key', key)

    if (activeKeyClicked) {
      // same key is clicked again > deactivate it
      newActiveKey = null
      path.pop()
    } else {
      // keep path elements below level clicked
      path = _.slice(this.state.path, 0, levelClicked + 1)
      const newPathElement = typeof hierarchy[key] === 'object' ? key : hierarchy[key]
      path.push(newPathElement)
      newActiveKey = key
    }

    // convert array to url string
    const newPath = path.join('/')
    // create url string
    const newUrl = `/${newPath}`

    this.setState({
      activeKey: newActiveKey,
      path: path
    })

    const activeObjectStoreValue = this.state.guid === guid ? null : guid
    app.Actions.loadActiveObjectStore(activeObjectStoreValue)
    app.Actions.loadPathStore(path)
    this.transitionTo(newUrl)
    this.forceUpdate()
  },

  render () {

    console.log('treeNodesFromHierarchyObject.js, render: state', this.state)

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
