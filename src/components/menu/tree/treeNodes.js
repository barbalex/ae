'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import { chain, clone } from 'lodash'
import replaceProblematicPathCharactersFromString from '../../../modules/replaceProblematicPathCharactersFromString.js'
import getObjectFromPath from '../../../modules/getObjectFromPath.js'

const onClickNode = ({ hO, path: previousPath }, event) => {
  event.stopPropagation()
  let guidOfObjectToLoad = hO.GUID
  // check if clicked node was already active:
  // if path.length is same or shorter as before
  const pathToLoad = clone(hO.path)
  if (previousPath.length <= hO.path.length) {
    // and last element is same as before
    const positionToCheck = hO.path.length - 1
    if (previousPath[positionToCheck] === hO.path[positionToCheck]) {
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
      app.Actions.showError({
        title: 'treeNodes.js: error getting object from path:',
        msg: error
      })
    )
}

const TreeNodes = ({ hierarchy, object, path }) => {
  let nodes = chain(hierarchy)
    .sortBy((hO) => hO.Name)
    .map((hO, index) => {
      const level = hO.path.length
      const activeKey = path[level - 1]
      const keyIsActive = replaceProblematicPathCharactersFromString(hO.Name) === activeKey
      const keyIsObjectShown = object !== undefined && hO.GUID && object._id === hO.GUID
      const glyph = (
        keyIsActive ?
        (keyIsObjectShown ? 'forward' : 'triangle-bottom') :
        (hO.children && hO.children.length > 0 ? 'play' : 'minus')
      )
      const onClick = onClickNode.bind(this, { hO, path })
      const showNode = keyIsActive && hO.children

      return (
        <li
          key={index}
          level={level}
          hO={hO}
          onClick={onClick}
        >
          <Glyphicon
            glyph={glyph}
            onClick={onClick}
          />
          <div
            className={keyIsActive ? 'active' : null}
          >
            {hO.Name.replace('&#39;', '\'')}
          </div>
          {
            showNode &&
            <Nodes
              hierarchy={hO.children}
              object={object}
              path={path}
            />
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

TreeNodes.displayName = 'TreeNodes'

TreeNodes.propTypes = {
  hierarchy: React.PropTypes.array,  // = hierarchy objects OF THIS LEVEL
  activeKey: React.PropTypes.string,
  object: React.PropTypes.object,
  path: React.PropTypes.array
}

export default TreeNodes
