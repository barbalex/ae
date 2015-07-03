'use strict'

import app from 'ampersand-app'
import React from 'react'
import Nodes from './treeNodesFromHierarchyObject.js'

export default React.createClass({
  displayName: 'TreeLevel1',

  propTypes: {
    hierarchy: React.PropTypes.object,
    gruppe: React.PropTypes.string,
    activeKey: React.PropTypes.string,
    isGuidPath: React.PropTypes.bool,
    guid: React.PropTypes.string,
    path: React.PropTypes.array
  },

  getInitialState () {
    // guidPath is when only a guid is contained in url
    const { hierarchy, isGuidPath, guid, gruppe, path} = this.props
    const activeKey = isGuidPath ? null : gruppe

    const state = {
      hierarchy: hierarchy,
      gruppe: gruppe,
      guid: guid,
      activeKey: activeKey,
      isGuidPath: isGuidPath,
      path: path
    }

    console.log('treeFromHierarchyObject.js getInitialState: state', state)

    return state
  },

  render () {
    const { hierarchy, gruppe, guid, path } = this.state
    const loading = app.loadingObjectStore && app.loadingObjectStore.length > 0
    const loadingGruppe = loading ? app.loadingObjectStore[0].replace('Macromycetes', 'Pilze') : 'Daten'

    console.log('treeFromHierarchyObject.js, render: state', this.state)

    const tree = (
      <div>
        <Nodes hierarchy={hierarchy} gruppe={gruppe} guid={guid} level={1} path={path}/>
      </div>
    )

    const loadingMessage = <p>Lade {loadingGruppe}...</p>

    return (
      <div>
        <div id='tree' className='baum'>
          {hierarchy ? tree : ''}
        </div>
        {loading ? loadingMessage : ''}
      </div>
    )
  }
})
