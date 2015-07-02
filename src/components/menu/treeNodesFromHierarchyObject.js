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
    hO: React.PropTypes.node,  // = hierarchy-object OF THIS LEVEL
    activeKey: React.PropTypes.string,
    gruppe: React.PropTypes.string,
    guid: React.PropTypes.string,
    path: React.PropTypes.array
  },

  getInitialState () {
    const { hO, gruppe, guid, path } = this.props
    const level = path.length
    // if this level is the guid, it's name needs to be gotten
    let activeKey = path[level - 1] || ''
    if (isGuid(activeKey)) {
      activeKey = _.findKey(hO, function (value) {
        return value === guid
      })
    }

    const state = {
      hO: hO,
      activeKey: activeKey,
      gruppe: gruppe,
      guid: guid,
      path: path
    }

    console.log('treeNodesFromHierarchyObject.js getInitialState: state', state)

    return state
  },

  componentDidMount () {
    setTreeHeight()
    this.listenTo(window.objectStore, this.onObjectStoreChange)
    this.listenTo(window.activeObjectStore, this.onActiveObjectStoreChange)
  },

  onObjectStoreChange (items, hO, gruppe) {
    // don't set state of hO - it get's passed down by parent component
    // do set activeKey > the new store is focused in tree
    this.setState({
      gruppe: gruppe
    })
    this.forceUpdate()
  },

  onActiveObjectStoreChange (object) {
    if (_.keys(object).length > 0) {
      this.setState({
        gruppe: object.Gruppe,
        guid: object._id
      })
    } else {
      this.setState({
        guid: null
      })
    }
  },

  onClickNode (params, event) {
    event.stopPropagation()

    console.log('treeNodesFromHierarchyObject.js onClickNode: params', params)
    console.log('treeNodesFromHierarchyObject.js onClickNode: this.state before', this.state)

    const { hO, activeKey, path} = this.state
    const level = path.length
    let newActiveKey
    const { key, guid } = params

    // TODO: GO ON REMOVING LEVEL FROM STATE, WORKING WITH PATH
    // TODO: THEN REMOVE FROM STATE WHAT IS NOT CHANGED IN COMPONENT
    
    // keep path elements below level clicked
    const pathElements = _.slice(path, 0, level - 1)
    if (key !== activeKey) {
      // get string of the element clicked
      const newPathElement = typeof hO[key] === 'object' ? key : hO[key]
      // add it to the path
      pathElements.push(newPathElement)
    }
    // convert array to url string
    const newPath = pathElements.join('/')
    // create url string
    const newUrl = `/${newPath}`

    if (key === activeKey) {
      console.log('treeNodesFromHierarchyObject.js onClickNode: key === activeKey')
      // same key is clicked again > deactivate it
      newActiveKey = null
    } else {
      console.log('treeNodesFromHierarchyObject.js onClickNode: key !== activeKey')
      console.log('treeNodesFromHierarchyObject.js onClickNode: key', key)
      newActiveKey = key
    }

    console.log('treeNodesFromHierarchyObject.js onClickNode: activeKey before setting state', activeKey)
    console.log('treeNodesFromHierarchyObject.js onClickNode: guid before setting state', guid)

    this.setState({
      activeKey: newActiveKey,
      guid: guid
    }, console.log('treeNodesFromHierarchyObject.js onClickNode: this.state after', this.state))

    if (this.state.guid !== guid) app.Actions.loadActiveObjectStore(guid)

    this.transitionTo(newUrl)
    this.forceUpdate()
  },

  render () {

    console.log('treeNodesFromHierarchyObject.js render: this.state', this.state)

    let nodes
    const that = this
    const { hO, activeKey, path, gruppe, guid } = this.state
    const level = path.length

    nodes = _.chain(hO)
      .keys()
      .sort()
      .map(function (key) {
        const keyIsActive = key === activeKey || hO[key] === activeKey
        const keyIsObject = typeof hO[key] === 'string'
        const glyph = keyIsActive ? (keyIsObject ? 'forward' : 'triangle-bottom') : (keyIsObject ? 'minus' : 'triangle-right')
        const onClickNode = that.onClickNode.bind(that, {'key': key, 'guid': (keyIsObject ? hO[key] : null)})

        return (
          <li level={level} key={key} onClick={onClickNode}>
            <Glyphicon glyph={glyph} onClick={onClickNode}/>
            <div className={keyIsActive ? 'active' : null}>{key}</div>
            {(key === activeKey && !keyIsObject) ? <Nodes hO={hO[key]} gruppe={gruppe} guid={guid} level={level + 1}/> : null}
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
