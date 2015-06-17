'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
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
    // console.log('treeFauna getInitialState called')
    const params = this.getParams()
    return {
      loading: !window.objectStore.loaded,
      hO: window.objectStore.getHierarchyOfGruppe(params.gruppe),
      gruppe: params.gruppe,
      guid: params.guid
    }
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
    // loadObjectStore if necessary
    if (!window.objectStore.loaded) app.Actions.loadHierarchyStore()
  },

  onStoreChange (hO) {
    console.log('treeFromHierarchyObject.js: store has changed, hO:', hO)
    this.setState({
      loading: false,
      hO: hO
    })
  },

  render () {
    let tree
    let loadingMessage

    tree = (
      <div className='baum'>
        <ul className='level1'>
          <Nodes level={1} hO={this.state.hO} gruppe={this.state.gruppe} guid={this.state.guid}/>
        </ul>
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
