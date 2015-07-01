'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import Nodes from './treeNodesFromHierarchyObject.js'
import isGuid from '../../modules/isGuid.js'

export default React.createClass({
  displayName: 'TreeLevel1',

  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    hO: React.PropTypes.object,  // = hierarchy-object
    gruppe: React.PropTypes.string,
    activeKey: React.PropTypes.string
  },

  getInitialState () {
    let gruppe
    let hO
    let activeKey

    const pathString = this.getParams().splat
    const path = pathString.split('/')
    // guidPath is when only a guid is contained in url
    const isGuidPath = path.length === 1 && isGuid(path[0])

    console.log('treeFromHierarchyObject.js, getInitialState: isGuidPath:', isGuidPath)

    if (isGuidPath) {
      const guid = path[0]
      app.Actions.loadActiveItemStore(guid)
      gruppe = null
      hO = null
      activeKey = null
    } else {
      gruppe = path[0]
      hO = window.objectStore.getHierarchy()
      activeKey = gruppe
    }

    const state = {
      hO: hO,
      gruppe: gruppe,
      activeKey: activeKey
    }

    // console.log('treeFromHierarchyObject.js getInitialState: state', state)

    return state
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onObjectStoreChange)
  },

  onObjectStoreChange (items, hO, gruppe) {
    console.log('treeFromHierarchyObject.js, onObjectStoreChange: store has changed')
    // console.log('treeFromHierarchyObject.js, onObjectStoreChange: gruppe', gruppe)

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

    // console.log('treeFromHierarchyObject.js is rendered')

    const tree = (
      <div>
        <Nodes hO={hO} level={1}/>
      </div>
    )

    const loadingMessage = <p>Lade {loadingGruppe}...</p>

    return (
      <div>
        <div id='tree' className='baum'>
          {hO ? tree : ''}
        </div>
        {loading ? loadingMessage : ''}
      </div>
    )
  }
})
