'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import Nodes from './treeNodesFromHierarchyObject.js'
import isGuid from '../../../modules/isGuid.js'

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
    return {
      loading: !window.objectStore.loaded,
      hO: window.objectStore.getHierarchyOfGruppe(gruppe),
      gruppe: gruppe
    }
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
    // loadObjectStore if necessary
    if (!window.objectStore.loaded) app.Actions.loadObjectStore()
  },

  onStoreChange (items, hO) {
    const gruppe = this.state.gruppe
    this.setState({
      loading: false,
      hO: hO[gruppe]
    })
  },

  render () {
    const hO = this.state.hO
    const gruppe = this.state.gruppe
    const loading = this.state.loading

    const tree = (
      <div className='baum'>
        <Nodes level={1} hO={hO} gruppe={gruppe}/>
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
