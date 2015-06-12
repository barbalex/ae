/*
 * needs this information to load:
 * - fauna-items for this klasse from the faunaStore (this.props.items)
 * - if/which node/object is active (this.props.treeState)
 *   represented by an object consisting of:
 *   {klasse: xxx, ordnung: xxx, familie: xxx, guid: xxx}
 */
'use strict'

import React from 'react'
import {State} from 'react-router'
import _ from 'lodash'
import FaunaOrdnung from './s3.js'

export default React.createClass({
  displayName: 'TreeLevel2',

  mixins: [State],

  propTypes: {
    items: React.PropTypes.object.isRequired,
    klasse: React.PropTypes.string.isRequired,
    ordnung: React.PropTypes.string
  },

  getInitialState () {
    const params = this.getParams()
    return {
      items: window.faunaStore.getItems(),
      klasse: params.klasse,
      ordnung: null
    }
  },

  onClickNode (ordnung) {
    window.router.transitionTo(`/fauna/${this.props.klasse}/${ordnung}`)
  },

  render () {
    let nodes
    const that = this
    const items = this.props.items
    const klasse = this.props.klasse

    // items nach Klasse filtern
    const itemsWithKlasse = _.pick(items, function (item) {
      if (item.Taxonomie && item.Taxonomie.Eigenschaften && item.Taxonomie.Eigenschaften.Klasse && item.Taxonomie.Eigenschaften.Klasse === klasse) {
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
        /*if (pair[0] === treeState.ordnung) {
          // dieser Node soll offen sein
          return (
            <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
              {pair[0]} ({pair[1]})
              <FaunaOrdnung items={items} treeState={treeState}/>
            </li>
          )
        }*/
        return (
          <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
            {pair[0]} ({pair[1]})
            <FaunaOrdnung/>
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
