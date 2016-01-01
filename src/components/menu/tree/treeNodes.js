'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import { chain, clone } from 'lodash'
import replaceProblematicPathCharactersFromString from '../../../modules/replaceProblematicPathCharactersFromString.js'
import getObjectFromPath from '../../../modules/getObjectFromPath.js'

const Nodes = React.createClass({
  displayName: 'TreeNodes',

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

    console.log('treeNodes.js, onClickNode, hO', hO)
    console.log('treeNodes.js, onClickNode, path', path)
    console.log('treeNodes.js, onClickNode, guidOfObjectToLoad', guidOfObjectToLoad)
    // check if clicked node was already active:
    // if path.length is same or shorter as before
    let pathToLoad = clone(hO.path)
    if (path.length <= hO.path.length) {
      // and last element is same as before
      const positionToCheck = hO.path.length - 1
      if (path[positionToCheck] === hO.path[positionToCheck]) {
        // an already active node was clicked
        // so remove the last element
        pathToLoad.pop()
      }
    }

    // find guid of last path element
    getObjectFromPath(pathToLoad)
      .then((objectToLoad) => {
        guidOfObjectToLoad = objectToLoad && objectToLoad._id ? objectToLoad._id : null
        // kick of actions
        app.Actions.loadActivePath(pathToLoad, guidOfObjectToLoad)
        app.Actions.loadActiveObject(guidOfObjectToLoad)
      })
      .catch((error) =>
        app.Actions.showError({title: 'treeNodes.js: error getting object from path:', msg: error})
      )
  },

  render () {
    const { hierarchy, object, path } = this.props
    let nodes = chain(hierarchy)
      .sortBy((hO) => hO.Name)
      .map((hO, index) => {
        const level = hO.path.length
        const activeKey = path[level - 1]
        const keyIsActive = replaceProblematicPathCharactersFromString(hO.Name) === path[level - 1]
        const keyIsObjectShown = object !== undefined && hO.GUID && object._id === hO.GUID
        const glyph = keyIsActive ? (keyIsObjectShown ? 'forward' : 'triangle-bottom') : (hO.children && hO.children.length > 0 ? 'play' : 'minus')
        const onClickNode = this.onClickNode.bind(this, { hO, path })
        const showNode = replaceProblematicPathCharactersFromString(hO.Name) === activeKey && hO.children

        return (
          <li
            key={index}
            level={level}
            hO={hO}
            onClick={onClickNode}>
            <Glyphicon glyph={glyph} onClick={onClickNode}/>
            <div
              className={keyIsActive ? 'active' : null}>
              {hO.Name.replace('&#39;', '\'')}
            </div>
            {
              showNode
              ? <Nodes
                  hierarchy={hO.children}
                  object={object}
                  path={path}/>
              : null
            }
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
