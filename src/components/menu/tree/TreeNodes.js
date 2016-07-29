import app from 'ampersand-app'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import { chain, clone } from 'lodash'
import { StyleSheet, css } from 'aphrodite'
import getObjectFromPath from '../../../modules/getObjectFromPath.js'

const onClickNode = ({ node, path: previousPath }, event) => {
  event.stopPropagation()
  let guidOfObjectToLoad = node.GUID
  // check if clicked node was already active:
  // if path.length is same or shorter as before
  const pathToLoad = clone(node.path)
  if (previousPath.length <= node.path.length) {
    // and last element is same as before
    const positionToCheck = node.path.length - 1
    if (previousPath[positionToCheck] === node.path[positionToCheck]) {
      // an already active node was clicked
      // so remove the last element
      pathToLoad.pop()
    }
  }

  // find guid of last path element
  getObjectFromPath(pathToLoad)
    .then((objectToLoad) => {
      guidOfObjectToLoad = objectToLoad && objectToLoad.id ? objectToLoad.id : null
      // kick of actions
      app.Actions.loadActivePath(pathToLoad, guidOfObjectToLoad)
      app.Actions.loadActiveObject(guidOfObjectToLoad)
    })
    .catch((error) =>
      addError({
        title: 'treeNodes.js: error getting object from path:',
        msg: error
      })
    )
}

const TreeNodes = ({
  nodes,
  object,
  idPath,
}) => {
  console.log('TreeNodes, render, nodes:', nodes)
  console.log('TreeNodes, render, object:', object)
  console.log('TreeNodes, render, idPath:', idPath)
  let nodesElements = chain(nodes)
    .sortBy((node) => node.data.name)
    .map((node, index) => {
      const level = node.path.length
      const activeKey = idPath[level - 1]
      const keyIsActive = node.data.id === activeKey
      const keyIsObjectShown = object !== undefined && node.data.id && object.id === node.data.id
      const glyph = (
        keyIsActive ?
        (keyIsObjectShown ? 'forward' : 'triangle-bottom') :
        (node.children && node.children.length > 0 ? 'play' : 'minus')
      )
      const onClick = onClickNode.bind(this, { node, idPath })
      const showNode = node.children
      const styles = StyleSheet.create({
        ul: {
          paddingLeft: 4,
          marginBottom: 0
        },
        li: {
          listStyleType: 'none',
          whiteSpace: 'nowrap'
        },
        div: {
          lineHeight: '16px',
          fontWeight: keyIsActive ? 'bold' : 'normal',
          padding: '2px 0',
          display: 'inline-block',
          marginLeft: 3,
          cursor: 'pointer',
          whiteSpace: 'normal',
          ':hover': {
            backgroundColor: '#FFFF90'
          }
        },
        glyph: {
          fontSize: '0.7em',
          position: 'relative',
          top: 5,
          verticalAlign: 'top',
          cursor: 'pointer'
        }
      })

      return (
        <li
          key={index}
          onClick={onClick}
          className={css(styles.li)}
        >
          <Glyphicon
            glyph={glyph}
            onClick={onClick}
            className={css(styles.glyph)}
          />
          <div
            className={css(styles.div)}
          >
            {node.data.name.replace('&#39;', '\'')}
          </div>
          {
            showNode &&
            <TreeNodes
              nodes={node.children}
              object={object}
              idPath={idPath}
            />
          }
        </li>
      )
    })
    .value()

  const mainStyles = StyleSheet.create({
    ul: {
      paddingLeft: (nodes.length && nodes[0].path.length === 1) ? 4 : 20,
      marginBottom: 0
    }
  })

  return (
    <ul className={css(mainStyles.ul)}>
      {nodesElements}
    </ul>
  )
}

TreeNodes.displayName = 'TreeNodes'

TreeNodes.propTypes = {
  nodes: React.PropTypes.array,  // = hierarchy objects OF THIS LEVEL
  activeKey: React.PropTypes.string,
  object: React.PropTypes.object,
  idPath: React.PropTypes.array
}

export default TreeNodes
