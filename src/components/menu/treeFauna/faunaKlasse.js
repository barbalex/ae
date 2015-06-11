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
import FaunaOrdnung from './faunaOrdnung.js'
import TreeFauna from './fauna.js'

export default React.createClass({
  displayName: 'FaunaKlasse',

  propTypes: {
    items: React.PropTypes.object.isRequired,
    treeState: React.PropTypes.object.isRequired
  },

  onClickNode (ordnung) {
    const treeState = this.props.treeState
    treeState.ordnung = ordnung
    const items = this.props.items

    console.log('faunaKlasse: treeState passed to TreeFauna:', treeState)

    React.render(<TreeFauna items={items} treeState={treeState}/>, document.getElementById('tree'))
    React.forceUpdate()
  },

  render () {
    let nodes
    const that = this
    const items = this.props.items
    const treeState = this.props.treeState

    // items nach Klasse filtern
    const itemsWithKlasse = _.pick(items, function (item) {
      if (item.Taxonomie && item.Taxonomie.Eigenschaften && item.Taxonomie.Eigenschaften.Klasse && item.Taxonomie.Eigenschaften.Klasse === treeState.klasse) {
        return true
      }
    })

    nodes = _.chain(itemsWithKlasse)
      // make an object {ordnung1: num, ordnung2: num}
      .countBy(function (item) {
        if (item.Taxonomie.Eigenschaften.Ordnung) {
          return item.Taxonomie.Eigenschaften.Ordnung
        }
      })
      // convert to array of arrays so it can be sorted
      .pairs()
      .sortBy(function (pair) {
        return pair[0]
      })
      // map to needed elements
      .map(function (pair) {
        if (pair[0] === treeState.ordnung) {
          // dieser Node soll offen sein
          return (
            <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
              {pair[0]} ({pair[1]})
              <FaunaOrdnung items={items} treeState={treeState}/>
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
      <ul className='level2'>
        {nodes}
      </ul>
    )
  }
})
