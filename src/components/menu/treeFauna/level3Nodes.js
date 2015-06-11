/*
 * needs this information to load:
 * - fauna-items for this klasse from the faunaStore (this.props.items)
 * - if/which node/object is active (this.props.treeState)
 *   represented by an object consisting of:
 *   {klasse: xxx, ordnung: xxx, familie: xxx, guid: xxx}
 */
'use strict'

import React from 'react'
import _ from 'lodash'
// import Level4Nodes from './Level4Nodes.js'
import TreeFauna from './treeFauna.js'

export default React.createClass({
  displayName: 'TreeLevel3Nodes',

  propTypes: {
    items: React.PropTypes.object.isRequired,
    treeState: React.PropTypes.object.isRequired
  },

  getInitialState () {
    console.log('level3Nodes: treeState:', this.props.treeState)
    console.log('level3Nodes: items:', this.props.items)
    return null
  },

  onClickNode (familie) {
    console.log('level3Nodes: familie clicked:', familie)

    const treeState = this.props.treeState
    treeState.familie = familie
    const items = this.props.items

    React.render(<TreeFauna items={items} treeState={treeState}/>, document.getElementById('tree'))
    React.forceUpdate()
  },

  render () {
    let nodes
    const that = this
    const items = this.props.items
    const treeState = this.props.treeState

    // items nach Klasse und Ordnung filtern
    const itemsWithOrdnung = _.pick(items, function (item) {
      if (item.Taxonomie && item.Taxonomie.Eigenschaften && item.Taxonomie.Eigenschaften.Klasse && item.Taxonomie.Eigenschaften.Klasse === treeState.klasse && item.Taxonomie.Eigenschaften.Ordnung && item.Taxonomie.Eigenschaften.Ordnung === treeState.ordnung) {
        return true
      }
    })

    nodes = _.chain(itemsWithOrdnung)
      // make an object {ordnung1: num, ordnung2: num}
      .countBy(function (item) {
        if (item.Taxonomie.Eigenschaften.Familie) {
          return item.Taxonomie.Eigenschaften.Familie
        }
      })
      // convert to array of arrays so it can be sorted
      .pairs()
      .sortBy(function (pair) {
        return pair[0]
      })
      // map to needed elements
      .map(function (pair) {
        if (pair[0] === treeState.familie) {
          // dieser Node soll offen sein
          return (
            <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
              {pair[0]} ({pair[1]})
              {/*<Level4Nodes items={items} treeState={treeState}/>*/}
            </li>
          )
        }
        return (
          <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
            {pair[0]} ({pair[1]})
          </li>
        )
      })
      .value()

    return (
      <ul className='level3'>
        {nodes}
      </ul>
    )
  }
})
