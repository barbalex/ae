'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import Nodes from './treeNodesFromHierarchyObject.js'

export default React.createClass({
  displayName: 'TreeLevel1',

  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    hO: React.PropTypes.object,  // = hierarchy-object
    gruppe: React.PropTypes.string
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const gruppe = path[0]
    const hO = window.objectStore.getHierarchy()
    const state = {
      hO: hO,
      gruppe: gruppe
    }

    console.log('treeFromHierarchyObject.js getInitialState: state', state)

    return state
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
  },

  onStoreChange (items, hO, gruppe) {
    // console.log('treeFromHierarchyObject.js, onStoreChange: store has changed')
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
