/*
 * needs this information to load:
 * - fauna-objects from the faunaStore (props)
 * - if/which node/object is active (state)
 *   represented by an object 'treeState' consisting of:
 *   {1_klasse, 2_ordnung, 3_familie, 4_guid}
 */
'use strict'

import React from 'react'
import _ from 'lodash'
import Level2Nodes from './Level2Nodes'

const TreeFauna = React.createClass({
  displayName: 'Tree',

  propTypes: {
    items: React.PropTypes.object.isRequired,
    treeState: React.PropTypes.object.isRequired
  },

  getInitialState () {
    console.log('treeFauna: treeState:', this.props.treeState)
    console.log('treeFauna: items:', this.props.items)
    return null
  },

  onClickNode (klasse) {
    console.log('treeFauna: Klasse clicked:', klasse)

    const treeState = { klasse: klasse, ordnung: null, familie: null, guid: null }
    const items = this.props.items

    React.render(<TreeFauna items={items} treeState={treeState}/>, document.getElementById('tree'))
  },

  render () {
    let nodes
    const that = this
    const items = this.props.items
    const treeState = this.props.treeState

    nodes = _.chain(items)
      // make an object {klasse1: num, klasse2: num}
      .countBy(function (item) {
        if (item.Taxonomie && item.Taxonomie.Eigenschaften && item.Taxonomie.Eigenschaften.Klasse) {
          return item.Taxonomie.Eigenschaften.Klasse
        }
      })
      // convert to array of arrays so it can be sorted
      .pairs()
      .sortBy(function (pair) {
        return pair[0]
      })
      // map to needed elements
      .map(function (pair) {
        if (pair[0] === treeState.klasse) {
          // dieser Node soll offen sein
          // items mit dieser Klasse filtern
          const itemsWithKlasse = _.pick(items, function (item) {
            if (item.Taxonomie && item.Taxonomie.Eigenschaften && item.Taxonomie.Eigenschaften.Klasse && item.Taxonomie.Eigenschaften.Klasse === treeState.klasse) {
              return true
            }
          })

          return (
            <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
              {pair[0]} ({pair[1]})
              <Level2Nodes items={itemsWithKlasse} treeState={treeState}/>
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
      <div className='baum'>
        <ul className='level1'>
          {nodes}
        </ul>
      </div>
    )
  }
})

export default TreeFauna
