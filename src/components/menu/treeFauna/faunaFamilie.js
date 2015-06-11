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
import TreeFauna from './fauna.js'

export default React.createClass({
  displayName: 'FaunaFamilie',

  propTypes: {
    items: React.PropTypes.object.isRequired,
    treeState: React.PropTypes.object.isRequired
  },

  onClickNode (guid) {
    console.log('faunaObjekt: guid clicked:', guid)
    // TODO: open form
  },

  render () {
    let nodes
    const that = this
    const items = this.props.items
    const treeState = this.props.treeState

    // items nach Klasse und Ordnung filtern
    const itemsWithFamilie = _.pick(items, function (item) {
      if (item.Taxonomie && item.Taxonomie.Eigenschaften && item.Taxonomie.Eigenschaften.Klasse && item.Taxonomie.Eigenschaften.Klasse === treeState.klasse && item.Taxonomie.Eigenschaften.Ordnung && item.Taxonomie.Eigenschaften.Ordnung === treeState.ordnung && item.Taxonomie.Eigenschaften.Familie && item.Taxonomie.Eigenschaften.Familie === treeState.familie) {
        return true
      }
    })

    nodes = _.chain(itemsWithFamilie)
      // make an object {ordnung1: num, ordnung2: num}
      .countBy(function (item) {
        if (item.Taxonomie.Eigenschaften['Artname vollständig']) {
          return item.Taxonomie.Eigenschaften['Artname vollständig']
        }
      })
      // convert to array of arrays so it can be sorted
      .pairs()
      .sortBy(function (pair) {
        return pair[0]
      })
      // map to needed elements
      .map(function (pair) {
        return (
          <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
            {pair[0]} ({pair[1]})
          </li>
        )
      })
      .value()

    return (
      <ul className='level4'>
        {nodes}
      </ul>
    )
  }
})
