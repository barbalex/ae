'use strict'

import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import isGuid from '../../modules/isGuid.js'

const Nodes = React.createClass({
  displayName: 'TreeLowerLevel',

  // ListenerMixin provides the listenTo method for the React component,
  // that works much like the one found in the Reflux's stores,
  // and handles the listeners during mount and unmount for you.
  // You also get the same listenToMany method as the store has.
  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    loading: React.PropTypes.bool,
    path: React.PropTypes.array,
    hO: React.PropTypes.node,  // = hierarchy-object OF THIS LEVEL
    level: React.PropTypes.number,
    activeKey: React.PropTypes.string,
    gruppe: React.PropTypes.string,
    guid: React.PropTypes.string
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const gruppe = this.props.gruppe || path[0]
    const lastPathElement = path[path.length - 1]
    const guid = isGuid(lastPathElement) ? lastPathElement : null
    const level = this.props.level
    const activeKey = path[level] || ''

    return {
      loading: !window.objectStore.loaded[gruppe],
      path: path,
      hO: this.props.hO,
      level: level,  // could calculate it as path.length
      activeKey: activeKey,
      gruppe: gruppe,
      guid: guid
    }
  },

  onClickNode (key, level, event) {
    event.stopPropagation()
    const hO = this.state.hO
    const path = this.state.path
    // keep path elements below level clicked
    const pathElements = _.slice(path, 0, level)
    // get string of the element clicked
    const newPathElement = typeof hO[key] === 'object' ? key : hO[key]
    // add it to the path
    pathElements.push(newPathElement)
    // convert array to url string
    const newPath = pathElements.join('/')
    // create url string
    const newUrl = `/${newPath}`

    this.setState({activeKey: key})
    window.router.transitionTo(newUrl)
  },

  render () {
    let nodes
    const that = this
    const hO = this.state.hO
    const activeKey = this.state.activeKey
    const guid = this.state.guid
    const gruppe = this.state.gruppe
    const level = this.state.level

    nodes = _.chain(hO)
      .keys()
      .sort()
      .map(function (key) {
        return (
          <li level={level} key={key} onClick={that.onClickNode.bind(that, key, level)}>
            <div className={key === activeKey ? 'active' : null}>{key}</div>
            {(key === activeKey && typeof hO[key] === 'object') || (guid && key !== guid) ? <Nodes level={level + 1} hO={hO[key]} gruppe={gruppe} guid={guid} activeKey={activeKey}/> : null}
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
