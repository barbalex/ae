'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import Nodes from './treeNodesFromHierarchyObject.js'
import isGuid from '../../modules/isGuid.js'

export default React.createClass({
  displayName: 'TreeLevel1',

  // ListenerMixin provides the listenTo method for the React component,
  // that works much like the one found in the Reflux's stores,
  // and handles the listeners during mount and unmount for you.
  // You also get the same listenToMany method as the store has.
  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    loading: React.PropTypes.bool,
    hO: React.PropTypes.object,  // = hierarchy-object
    gruppe: React.PropTypes.string,
    guid: React.PropTypes.string
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const gruppe = this.props.gruppe || path[0]
    const lastPathElement = path[path.length - 1]
    const guid = this.props.guid || (isGuid(lastPathElement) ? lastPathElement : null)
    const hO = this.props.hO || window.objectStore.getHierarchy()

    console.log('treeFromHierarchyObject: path[0]', path[0])
    console.log('treeFromHierarchyObject: this.props.gruppe', this.props.gruppe)

    return {
      loading: !window.objectStore.loaded[gruppe],
      hO: hO,
      gruppe: gruppe,
      guid: guid
    }
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
    // loadObjectStore if necessary
    if (!window.objectStore.loaded[this.state.gruppe]) app.Actions.loadObjectStore(this.state.gruppe)
  },

  onStoreChange (items, hO) {
    console.log('treeFromHierarchyObject.js: store has changed')

    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const gruppe = path[0]
    const lastPathElement = path[path.length - 1]
    const guid = isGuid(lastPathElement) ? lastPathElement : null
    this.setState({
      loading: !window.objectStore.loaded[gruppe],
      hO: hO[gruppe],
      guid: guid
    })
    this.forceUpdate()
  },

  render () {
    const hO = this.state.hO
    const gruppe = this.state.gruppe
    const guid = this.state.guid
    const loading = this.state.loading

    const tree = (
      <div>
        <Nodes level={1} guid={guid} gruppe={gruppe} hO={hO}/>
      </div>
    )

    const loadingMessage = <p>Lade Daten...</p>

    return (
      <div>
        <div className='treeBeschriftung'></div>
        <div id='tree' className='baum'>
          {loading ? loadingMessage : tree}
        </div>
      </div>
    )
  }
})
