/*
 * needs this information to load:
 * - fauna-items from the faunaStore (this.props.items)
 * - if/which node/object is active (this.props.treeState)
 *   represented by an object consisting of:
 *   {klasse: xxx, ordnung: xxx, familie: xxx, guid: xxx}
 */
'use strict'

import React from 'react'
import {State} from 'react-router'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import FaunaKlasse from './faunaKlasse.js'

const store = window.faunaStore

const TreeFauna = React.createClass({
  displayName: 'Fauna',

  mixins: [ListenerMixin, State],

  propTypes: {
    items: React.PropTypes.object.isRequired,
    klasse: React.PropTypes.string
  },

  getInitialState () {
    console.log('window.faunaStore.getItems', store.getItems())
    return {
      items: store.getItems(),
      klasse: null
    }
  },

  componentDidMount () {
    this.listenTo(store, this.onStoreChange)
  },

  onStoreChange (items) {
    console.log('fauna: faunaStore changed, items:', items)
    this.setState({
      items: items
    })
  },

  onClickNode (klasse) {
    window.router.transitionTo(`/fauna/${klasse}`)
  },

  render () {
    let nodes
    const that = this
    const items = this.props.items
    const klasse = this.props.klasse

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
        if (pair[0] === klasse) {
          // dieser Node soll offen sein
          return (
            <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
              {pair[0]} ({pair[1]})
              <FaunaKlasse/>
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
