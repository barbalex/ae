'use strict'

import app from 'ampersand-app'
import React from 'react'
import Nodes from './treeNodesFromHierarchyObject.js'

export default React.createClass({
  displayName: 'TreeLevel1',

  propTypes: {
    hierarchy: React.PropTypes.object,
    gruppe: React.PropTypes.string,
    guid: React.PropTypes.string,
    path: React.PropTypes.array
  },

  render () {
    const { hierarchy, gruppe, guid, path } = this.props
    const loading = app.loadingObjectStore && app.loadingObjectStore.length > 0
    const loadingGruppe = loading ? app.loadingObjectStore[0].replace('Macromycetes', 'Pilze') : 'Daten'
    // console.log('treeFromHierarchyObject.js, render: props', this.props)

    const tree = (
      <div>
        <Nodes hierarchy={hierarchy} gruppe={gruppe} guid={guid} level={1} path={path} />
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
