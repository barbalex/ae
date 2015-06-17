'use strict'

import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'

const Nodes = React.createClass({
  displayName: 'TreeLowerLevel',

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
    const params = this.getParams()
    return {
      loading: !window.objectStore.loaded,
      hO: this.props.hO,
      level: this.props.level,
      activeKey: '',
      gruppe: params.gruppe,
      guid: this.props.guid || null
    }
  },

  onClickNode (key, event) {
    event.stopPropagation()
    if (typeof this.state.hO[key] === 'object') {
      this.setState({activeKey: key})
    } else {
      this.setState({activeKey: key, guid: key})
      window.router.transitionTo(`/${this.state.gruppe}/${this.state.hO[key]}`)
    }
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
          <li key={key} onClick={that.onClickNode.bind(that, key)}>
            <div className={key === activeKey ? 'active' : null}>{key}</div>
            {(key === activeKey && typeof hO[key] === 'object') || (guid && key !== guid) ? <Nodes level={level + 1} hO={hO[key]} gruppe={gruppe} guid={guid}/> : null}
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
