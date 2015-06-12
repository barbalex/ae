/*
 * needs this information to load:
 * - fauna-items for this klasse from the faunaStore (this.props.items)
 * - if/which node/object is active (this.props.treeState)
 *   represented by an object consisting of:
 *   {klasse: xxx, ordnung: xxx, familie: xxx, guid: xxx}
 */
'use strict'

import React from 'react'
import Router from 'react-router'
import _ from 'lodash'
import TreeFauna from './s1.js'

export default React.createClass({
  displayName: 'TreeLevel3',

  mixins: [Router.State],

  propTypes: {
    items: React.PropTypes.object.isRequired,
    klasse: React.PropTypes.string.isRequired,
    ordnung: React.PropTypes.string.isRequired,
    familie: React.PropTypes.string
  },

  getInitialState () {
    const params = this.getParams()
    return {
      items: window.faunaStore.getItems(),
      klasse: params.klasse,
      ordnung: params.ordnung,
      familie: null
    }
  },

  onClickNode (familie) {
    window.router.transitionTo(`/fauna/${this.props.klasse}/${ordnung}/${familie}`)
  },

  render () {
    let nodes
    const that = this
    const items = this.props.items
    const klasse = this.props.klasse
    const ordnung = this.props.ordnung

    // items nach Klasse und Ordnung filtern
    const itemsWithOrdnung = _.pick(items, function (item) {
      if (item.Taxonomie && item.Taxonomie.Eigenschaften && item.Taxonomie.Eigenschaften.Klasse && item.Taxonomie.Eigenschaften.Klasse === klasse && item.Taxonomie.Eigenschaften.Ordnung && item.Taxonomie.Eigenschaften.Ordnung === ordnung) {
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
