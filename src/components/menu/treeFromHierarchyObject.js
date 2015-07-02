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
    hO: React.PropTypes.object,
    gruppe: React.PropTypes.string,
    activeKey: React.PropTypes.string,
    isGuidPath: React.PropTypes.bool,
    guid: React.PropTypes.string,
    path: React.PropTypes.array
  },

  getInitialState () {
    let hO
    let activeKey

    // guidPath is when only a guid is contained in url
    const { isGuidPath, guid, gruppe, path} = this.props

    if (isGuidPath) {
      hO = null
      activeKey = null
    } else {
      hO = window.objectStore.getHierarchy()
      activeKey = gruppe
    }

    const state = {
      hO: hO,
      gruppe: gruppe,
      guid: guid,
      activeKey: activeKey,
      isGuidPath: isGuidPath,
      path: path
    }

    console.log('treeFromHierarchyObject.js getInitialState: state', state)

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
    const { hO, gruppe, guid, path } = this.state
    const loading = app.loadingObjectStore && app.loadingObjectStore.length > 0
    const loadingGruppe = loading ? app.loadingObjectStore[0] : 'Daten'

    // console.log('treeFromHierarchyObject.js is rendered')

    const tree = (
      <div>
        <Nodes hO={hO} gruppe={gruppe} guid={guid} level={1} path={path}/>
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
