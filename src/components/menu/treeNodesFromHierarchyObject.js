'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import _ from 'lodash'

const Nodes = React.createClass({
  displayName: 'TreeLowerLevel',

  propTypes: {
    hierarchy: React.PropTypes.array,  // = hierarchy objects OF THIS LEVEL
    activeKey: React.PropTypes.string,
    gruppe: React.PropTypes.string,
    object: React.PropTypes.object,
    path: React.PropTypes.array
  },

  onClickNode (params, event) {
    event.stopPropagation()
    const { hO } = params
    app.Actions.loadActiveObjectStore(hO.GUID)
    app.Actions.loadPathStore(hO.path, hO.GUID)
  },

  render () {
    // console.log('treeNodesFromHierarchyObject.js, render: state', this.state)
    console.log('treeNodesFromHierarchyObject.js, render: props', this.props)
    let nodes
    const that = this
    const { hierarchy, object, path, gruppe } = this.props

    nodes = _.chain(hierarchy)
      .sortBy(function (hO) {
        return hO.Name
      })
      .map(function (hO) {
        const level = hO.path.length
        const activeKey = path[level - 1]
        const keyIsActive = hO.Name === path[level - 1]
        const keyIsObjectShown = object !== undefined && hO.GUID && object._id === hO.GUID
        const glyph = keyIsActive ? (keyIsObjectShown ? 'forward' : 'triangle-bottom') : (hO.children && hO.children.length > 0 ? 'triangle-right' : 'minus')
        const onClickNode = that.onClickNode.bind(that, {'hO': hO, 'gruppe': gruppe})

        return (
          <li key={hO.Name} level={level} hO={hO} onClick={onClickNode}>
            <Glyphicon glyph={glyph} onClick={onClickNode}/>
            <div className={keyIsActive ? 'active' : null}>{hO.Name.replace('&#39;', '\'')}</div>
            {(hO.Name === activeKey && hO.children) ? <Nodes hierarchy={hO.children} gruppe={gruppe} object={object} path={path}/> : null}
          </li>
        )
      })
      .value()

    return (
      <ul>
        {nodes}
      </ul>
    )
  }
})

export default Nodes
