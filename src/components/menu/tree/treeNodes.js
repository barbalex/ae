'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import replaceProblematicPathCharactersFromString from '../../../modules/replaceProblematicPathCharactersFromString.js'
import getObjectFromPath from '../../../modules/getObjectFromPath.js'

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

    // find guid of last path element
    getObjectFromPath(pathToLoad)
      .then((objectToLoad) => {
        guidOfObjectToLoad = objectToLoad && objectToLoad._id ? objectToLoad._id : null
        // kick of actions
        app.Actions.loadActivePathStore(pathToLoad, guidOfObjectToLoad)
        app.Actions.loadActiveObjectStore(guidOfObjectToLoad)
      })
      .catch((error) =>
        app.Actions.showError({title: 'treeNodes.js: error getting object from path:', msg: error})
      )
  },

  render () {
    let nodes
    const { hierarchy, object, path } = this.props
    nodes = _.chain(hierarchy)
      .sortBy((hO) => hO.Name)
      .map((hO) => {
        const level = hO.path.length
        const activeKey = path[level - 1]
        const keyIsActive = replaceProblematicPathCharactersFromString(hO.Name) === path[level - 1]
        const keyIsObjectShown = object !== undefined && hO.GUID && object._id === hO.GUID
        const glyph = keyIsActive ? (keyIsObjectShown ? 'forward' : 'triangle-bottom') : (hO.children && hO.children.length > 0 ? 'triangle-right' : 'minus')
        const onClickNode = this.onClickNode.bind(this, {'hO': hO, 'path': path})
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
