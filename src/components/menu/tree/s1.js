'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import S2 from './s2.js'
import FourOhFour from '../../main/fourOhFour.js'

export default React.createClass({
  displayName: 'TreeLevel1',

  // ListenerMixin provides the listenTo method for the React component,
  // that works much like the one found in the Reflux's stores,
  // and handles the listeners during mount and unmount for you.
  // You also get the same listenToMany method as the store has.
  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    loading: React.PropTypes.bool,
    items: React.PropTypes.object,
    s2: React.PropTypes.string
  },

  getInitialState () {
    // console.log('treeFauna getInitialState called')
    const params = this.getParams()
    return {
      loading: !window.faunaStore.loaded,
      items: window.faunaStore.getInitialState(),
      s2: params.s2
    }
  },

  componentDidMount () {
    this.listenTo(window.faunaStore, this.onStoreChange)
    // loadFaunaStore if necessary
    if (!window.faunaStore.loaded) app.Actions.loadFaunaStore()
  },

  onStoreChange (items) {
    this.setState({
      loading: false,
      items: items
    })
  },

  onClickNodeInS1 (s2, event) {
    event.stopPropagation()
    this.setState({s2: s2})
    const url = `/Fauna/${s2}`
    window.router.transitionTo(url)
  },

  render () {
    let nodes
    let tree
    let loadingMessage
    const that = this
    const items = this.state.items
    const s2 = this.state.s2

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
      // div arount Text is for interacting wich the li element
      .map(function (pair) {
        return (
          <li key={pair[0]} onClick={that.onClickNodeInS1.bind(that, pair[0])}>
            <div>{pair[0]} ({pair[1]})</div>
            {pair[0] === s2 ? <S2/> : null}
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
        <div className='treeBeschriftung'></div>
        <div id='tree' className='baum'>
          {this.state.loading ? loadingMessage : tree}
        </div>
      </div>
    )
  }
})
