/*
 * needs this information to load:
 * - fauna-items from the faunaStore (this.props.items)
 * - if/which node/object is active (this.props.treeState)
 *   represented by an object consisting of:
 *   {s2: xxx, ordnung: xxx, familie: xxx, guid: xxx}
 */
'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State } from 'react-router'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import S2 from './s2.js'

export default React.createClass({
  displayName: 'TreeLevel1',

  // ListenerMixin provides the listenTo method for the React component,
  // that works much like the one found in the Reflux's stores,
  // and handles the listeners during mount and unmount for you.
  // You also get the same listenToMany method as the store has.
  mixins: [ListenerMixin, State],

  propTypes: {
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
      s2: null
    }
  },

  componentDidMount () {
    this.listenTo(window.faunaStore, this.onStoreChange)

    const params = this.getParams()
    console.log('s1: params.s1:', params.s1)
    switch (params.s1) {
    case 'fauna':
      // loadFaunaStore if necessary
      if (!window.faunaStore.loaded) app.Actions.loadFaunaStore()
      break
    }
  },

  onStoreChange (items) {
    // console.log('s1: store changed, items:', items)
    this.setState({
      loading: false,
      items: items
    })
    // console.log('s1: this.props.items', this.props.items)
    // console.log('s1: this.props.s1', this.props.s1)
  },

  onClickNode (s2) {
    window.router.transitionTo(`/${this.props.s1}/${s2}`)
  },

  render () {
    let nodes
    let tree
    let loadingMessage
    const that = this
    const items = this.props.items
    const s2 = this.props.s2

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
        if (pair[0] === s2) {
          // dieser Node soll offen sein
          return (
            <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
              {pair[0]} ({pair[1]})
              {/*<S2/>*/}
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

    tree = (
      <div className='baum'>
        <ul className='level1'>
          {nodes}
        </ul>
      </div>
    )

    loadingMessage = <p>Lade Daten...</p>

    return (
      <div>
        <div id='treeMitteilung' style={{display: 'none'}}>hole Daten...</div>
        <div className='treeBeschriftung'></div>
        <div id='tree' className='baum'>
          {this.state.loading ? loadingMessage : tree}
        </div>
      </div>
    )
  }
})
