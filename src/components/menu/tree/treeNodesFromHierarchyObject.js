'use strict'

import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'

const Nodes = React.createClass({
  displayName: 'TreeLevel1',

  // ListenerMixin provides the listenTo method for the React component,
  // that works much like the one found in the Reflux's stores,
  // and handles the listeners during mount and unmount for you.
  // You also get the same listenToMany method as the store has.
  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    loading: React.PropTypes.bool,
    hO: React.PropTypes.object,  // = hierarchy-object OF THIS LEVEL
    level: React.PropTypes.number,
    activeKey: React.PropTypes.string,
    gruppe: React.PropTypes.string,
    guid: React.PropTypes.string
  },

  getInitialState () {
    // must be passed from parent component
    return {
      loading: !window.hierarchyStore.loaded,
      hO: this.props.hO,
      level: this.props.level,
      activeKey: '',
      gruppe: this.props.gruppe,
      guid: this.props.gruppe
    }
  },

  onClickHierarchyNode (activeKey) {
    this.setState({activeKey: activeKey})
    // TODO: Render next level = treeFromHierarchyObject
  },

  onClickObjectNode (guid) {
    // TODO: render form
  },

  render () {
    let nodes
    const that = this
    const hO = this.state.hO
    const activeKey = this.state.activeKey

    nodes = _.chain(hO)
      .keys()
      .map(function (key) {
        // TODO: if guid and value = guid return different
        if (this.state.guid) {
          return (
            <li key={hO[key]} onClick={that.onClickObjectNode.bind(that, hO[key])}>
              <div className={key === activeKey ? 'active' : null}>{key}</div>
            </li>
          )
        }
        return (
          <li key={key} onClick={that.onClickHierarchyNode.bind(that, key)}>
            <div className={key === activeKey ? 'active' : null}>{key}</div>
            {key === activeKey ? <Nodes level={this.state.level + 1} hO={this.state.hO[key]} gruppe={this.state.gruppe} guid={this.state.guid}/> : null}
          </li>
        )
      })
      .value()

    return (
      <ul className={this.state.level}>
        {nodes}
      </ul>
    )
  }
})

export default Nodes
