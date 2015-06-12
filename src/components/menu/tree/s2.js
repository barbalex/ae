/*
 * needs this information to load:
 * - fauna-items for this s1 from the faunaStore (this.state.items)
 * - if/which node/object is active (this.state.treeState)
 *   represented by an object consisting of:
 *   {s1: xxx, s2: xxx, familie: xxx, guid: xxx}
 */
'use strict'

import app from 'ampersand-app'
import React from 'react'
import {State} from 'react-router'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import S3 from './s3.js'

export default React.createClass({
  displayName: 'TreeLevel2',

  // ListenerMixin provides the listenTo method for the React component,
  // that works much like the one found in the Reflux's stores,
  // and handles the listeners during mount and unmount for you.
  // You also get the same listenToMany method as the store has.
  mixins: [ListenerMixin, State],

  propTypes: {
    loading: React.PropTypes.bool.isRequired,
    items: React.PropTypes.object.isRequired,
    s1: React.PropTypes.string.isRequired,
    s2: React.PropTypes.string
  },

  getInitialState () {
    const params = this.getParams()
    return {
      loading: !window.faunaStore.loaded,
      items: window.faunaStore.getInitialState(),
      s1: params.s1,
      s2: params.s2
    }
  },

  componentDidMount () {
    const params = this.getParams()
    switch (params.s1) {
    case 'Fauna':
      this.listenTo(window.faunaStore, this.onStoreChange)
      // loadFaunaStore if necessary
      if (!window.faunaStore.loaded) app.Actions.loadFaunaStore()
      break
    }
  },

  onStoreChange (items) {
    this.setState({
      loading: false,
      items: items
    })
  },

  onClickNode (s3) {
    window.router.transitionTo(`/${this.state.s1}/${this.state.s2}/${s3}`)
  },

  render () {
    let nodes
    const that = this
    const items = this.state.items
    const s2 = this.state.s2

    console.log('s1: rendering')
    console.log('s1: items:', items)
    console.log('s1: s2:', s2)

    // items nach Klasse filtern
    const itemsWithKlasse = _.pick(items, function (item) {
      if (item.Taxonomie && item.Taxonomie.Eigenschaften && item.Taxonomie.Eigenschaften.Klasse && item.Taxonomie.Eigenschaften.Klasse === s2) {
        return true
      }
    })

    console.log('s1: itemsWithKlasse:', itemsWithKlasse)

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
        /*if (pair[0] === treeState.s2) {
          // dieser Node soll offen sein
          return (
            <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
              {pair[0]} ({pair[1]})
              <S3 items={items} treeState={treeState}/>
            </li>
          )
        }*/
        return (
          <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
            {pair[0]} ({pair[1]})
            {/*<S3/>*/}
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
