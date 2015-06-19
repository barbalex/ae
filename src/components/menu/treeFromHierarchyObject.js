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
    hO: React.PropTypes.object,  // = hierarchy-object
    gruppe: React.PropTypes.string
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    // const gruppe = this.props.gruppe  // always gets passed down from home.js
    const gruppe = path[0]
    const hO = window.objectStore.getHierarchy()

    // console.log('treeFromHierarchyObject: path[0]', path[0])
    // console.log('treeFromHierarchyObject: this.props.gruppe', this.props.gruppe)
    console.log('treeFromHierarchyObject.js getInitialState')

    return {
      hO: hO,
      gruppe: gruppe
    }
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
    // loadObjectStore if necessary
    if (!window.objectStore.loaded[this.state.gruppe]) app.Actions.loadObjectStore(this.state.gruppe)
  },

  onStoreChange (items, hO, gruppe) {
    console.log('treeFromHierarchyObject.js, onStoreChange: store has changed')
    // console.log('treeFromHierarchyObject.js, onStoreChange: gruppe', gruppe)

    this.setState({
      hO: hO,
      gruppe: gruppe
    })
    this.forceUpdate()
  },

  render () {
    const hO = this.state.hO
    const loading = app.loadingObjectStore && app.loadingObjectStore.length > 0
    const loadingGruppe = loading ? app.loadingObjectStore[0] : 'Daten'

    const tree = (
      <div>
        <Nodes hO={hO}/>
      </div>
    )

    const loadingMessage = <p>Lade {loadingGruppe}...</p>

    return (
      <div>
        <div id='tree' className='baum'>
          {tree}
        </div>
        {loading ? loadingMessage : ''}
      </div>
    )
  }
})
