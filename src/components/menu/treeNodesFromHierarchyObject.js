'use strict'

import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import { Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import isGuid from '../../modules/isGuid.js'
import setTreeHeight from '../../modules/setTreeHeight.js'

const Nodes = React.createClass({
  displayName: 'TreeLowerLevel',

  // ListenerMixin provides the listenTo method for the React component,
  // that works much like the one found in the Reflux's stores,
  // and handles the listeners during mount and unmount for you.
  // You also get the same listenToMany method as the store has.
  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    hO: React.PropTypes.node,  // = hierarchy-object OF THIS LEVEL
    level: React.PropTypes.number,
    activeKey: React.PropTypes.string,
    gruppe: React.PropTypes.string,
    guid: React.PropTypes.string
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const gruppe = path[0]
    const lastPathElement = path[path.length - 1]
    const guid = isGuid(lastPathElement) ? lastPathElement : null
    const level = this.props.level || path.length
    const activeKey = path[level - 1] || ''
    const hO = this.props.hO
    const state = {
      hO: hO,
      level: level,
      activeKey: activeKey,
      gruppe: gruppe,
      guid: guid
    }

    console.log('treeNodesFromHierarchyObject.js getInitialState: state', state)

    return state
  },

  componentDidMount () {
    setTreeHeight()
    this.listenTo(window.objectStore, this.onStoreChange)
  },

  onStoreChange (items, hO, gruppe) {
    console.log('treeNodesFromHierarchyObject.js, onStoreChange: gruppe', gruppe)
    // don't set state of hO - it get's passed down by parent component
    // do set activeKey > the new store is focused in tree
    this.setState({
      gruppe: gruppe
    })
    this.forceUpdate()
  },

  onClickNode (params, event) {
    event.stopPropagation()

    // console.log('treeNodesFromHierarchyObject.js onClickNode: params', params)

    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const { key, activeKey, level } = params
    const hO = this.state.hO
    // keep path elements below level clicked
    const pathElements = _.slice(path, 0, level - 1)  // TODO WRONG
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
    this.setState({
      activeKey: key === activeKey ? null : key,
      level: level
    })
    this.transitionTo(newUrl)
  },

  render () {
    let nodes
    const that = this
    const { guid, hO, activeKey, level } = this.state

    // console.log('treeNodesFromHierarchyObject.js render: activeKey', activeKey)

    nodes = _.chain(hO)
      .keys()
      .sort()
      .map(function (key) {
        return (
          <li level={level} key={key} onClick={that.onClickNode.bind(that, {'key': key, 'activeKey': activeKey, 'level': level})}>
            <Glyphicon glyph={key === activeKey ? (typeof hO[key] !== 'object' ? 'forward' : 'triangle-bottom') : (typeof hO[key] !== 'object' ? 'minus' : 'triangle-right')} onClick={that.onClickNode.bind(that, {'key': key, 'activeKey': activeKey, 'level': level})}/>
            <div className={key === activeKey ? 'active' : null}>{key}</div>
            {(key === activeKey && typeof hO[key] === 'object') || (guid && key !== guid) ? <Nodes level={level + 1} hO={hO[key]}/> : null}
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
