'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import replaceProblematicPathCharactersFromString from '../../modules/replaceProblematicPathCharactersFromString.js'
import getObjectFromPath from '../../modules/getObjectFromPath.js'

const Nodes = React.createClass({
  displayName: 'TreeLowerLevel',

  propTypes: {
    hierarchy: React.PropTypes.array,  // = hierarchy objects OF THIS LEVEL
    activeKey: React.PropTypes.string,
    object: React.PropTypes.object,
    path: React.PropTypes.array
  },

  onClickNode (params, event) {
    event.stopPropagation()
    const { hO, path } = params
    let guidOfObjectToLoad = hO.GUID
    // check if clicked node was already active:
    // if path.length is same or shorter as before
    let pathToLoad = _.clone(hO.path)
    if (path.length <= hO.path.length) {
      // and last element is same as before
      const positionToCheck = hO.path.length - 1
      if (path[positionToCheck] === hO.path[positionToCheck]) {
        // an already active node was clicked
        // so remove the last element
        pathToLoad.pop()
      }
    }
    
    console.log('pathToLoad', pathToLoad)

    // find guid of last path element
    getObjectFromPath(pathToLoad)
      .then(function (objectToLoad) {

        console.log('objectToLoad', objectToLoad)

        guidOfObjectToLoad = objectToLoad && objectToLoad._id ? objectToLoad._id : null
        // kick of actions
        app.Actions.loadPathStore(pathToLoad, guidOfObjectToLoad)
        app.Actions.loadActiveObjectStore(guidOfObjectToLoad)
      })
      .catch(function (error) {
        console.log('treeNodesFromHierarchyObject.js: error getting object from path:', error)
      })
  },

  render () {
    // console.log('treeNodesFromHierarchyObject.js, render: props', this.props)
    let nodes
    const that = this
    const { hierarchy, object, path } = this.props
    nodes = _.chain(hierarchy)
      .sortBy(function (hO) {
        return hO.Name
      })
      .map(function (hO) {
        const level = hO.path.length
        const activeKey = path[level - 1]
        const keyIsActive = replaceProblematicPathCharactersFromString(hO.Name) === path[level - 1]
        const keyIsObjectShown = object !== undefined && hO.GUID && object._id === hO.GUID
        const glyph = keyIsActive ? (keyIsObjectShown ? 'forward' : 'triangle-bottom') : (hO.children && hO.children.length > 0 ? 'triangle-right' : 'minus')
        const onClickNode = that.onClickNode.bind(that, {'hO': hO, 'path': path})
        const showNode = replaceProblematicPathCharactersFromString(hO.Name) === activeKey && hO.children

        return (
          <li key={hO.Name} level={level} hO={hO} onClick={onClickNode}>
            <Glyphicon glyph={glyph} onClick={onClickNode}/>
            <div className={keyIsActive ? 'active' : null}>{hO.Name.replace('&#39;', '\'')}</div>
            {showNode ? <Nodes hierarchy={hO.children} object={object} path={path}/> : ''}
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
