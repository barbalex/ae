'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import Nodes from './treeNodesFromHierarchyObject.js'

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
    // console.log('treeFromHierarchyObject getInitialState called')
    const params = this.getParams()
    return {
      loading: !window.objectStore.loaded,
      hO: window.objectStore.getHierarchyOfGruppe(params.gruppe),
      gruppe: params.gruppe,
      guid: params.guid || null
    }
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
    // loadObjectStore if necessary
    if (!window.objectStore.loaded) app.Actions.loadObjectStore()
  },

  onStoreChange (items, hO) {
    this.setState({
      loading: false,
      hO: hO[this.state.gruppe]
    })
  },

  render () {
    let tree
    let loadingMessage

    // console.log('treeFromHierarchyObject.js: this.state.hO:', this.state.hO)

    tree = (
      <div className='baum'>
        <Nodes level={1} hO={this.state.hO} gruppe={this.state.gruppe} guid={this.state.guid}/>
      </div>
    )

    loadingMessage = <p>Lade Daten...</p>

    return (
      <div>
        <div className='treeBeschriftung'></div>
        <div id='tree' className='baum'>
          {this.state.loading ? loadingMessage : tree}
        </div>
      </div>
    )
  }
})
