import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import { chain } from 'lodash'
import { StyleSheet, css } from 'aphrodite'
import TreeNodesCt from './TreeNodesCt'

const TreeNodes = ({
  nodes,
  object,
  idPath,
  nodeChildrenRemove,
  nodeChildrenAdd,
}) => {
  // console.log('TreeNodes, render, nodes:', nodes)
  // console.log('TreeNodes, render, object:', object)
  // console.log('TreeNodes, render, idPath:', idPath)
  let nodesElements = chain(nodes)
    .sortBy((node) => node.data.name)
    .map((node, index) => {
      const level = node.data.path.length
      const activeKey = idPath[level - 1]
      const keyIsActive = node.data.id === activeKey
      // const keyIsActive = idPath.includes(node.data.id)
      const keyIsObjectShown = node.data.id && object.id && object.id === node.data.object_id
      const glyph = (
        keyIsActive ?
        (keyIsObjectShown ? 'forward' : 'triangle-bottom') :
        (node.data.object_id ? 'minus' : 'play')
      )
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
      const onClick = (event) => {
        event.stopPropagation()
        console.log('TreeNodes.js, node clicked:', node)
        console.log('TreeNodes.js, node.children:', node.children)
        console.log('TreeNodes.js, node id:', node.id)
        if (node.children) {
          nodeChildrenRemove(node)
        } else {
          nodeChildrenAdd(node)
        }
      }

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
            <TreeNodesCt
              nodes={node.children}
            />
          }
        </li>
      )
    })
    .value()

  const mainStyles = StyleSheet.create({
    ul: {
      paddingLeft: (nodes.length && nodes[0].data.path.length === 1) ? 3 : 12,
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
  idPath: React.PropTypes.array,
  nodeChildrenRemove: React.PropTypes.func,
  nodeChildrenAdd: React.PropTypes.func,
}

export default TreeNodes
