'use strict'

import React from 'react'
import Nodes from './treeNodesFromHierarchyObject.js'

export default React.createClass({
  displayName: 'TreeLevel1',

  propTypes: {
    hierarchy: React.PropTypes.array,
    gruppe: React.PropTypes.string,
    object: React.PropTypes.object,
    path: React.PropTypes.array
  },

  render () {
    const { hierarchy, gruppe, object, path } = this.props
    const loading = window.objectStore.groupsLoading && window.objectStore.groupsLoading.length > 0
    const loadingGruppe = loading ? window.objectStore.groupsLoading[0].replace('Macromycetes', 'Pilze') : 'Daten'

    const tree = (
      <div>
        <Nodes hierarchy={hierarchy} gruppe={gruppe} object={object} path={path} />
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
