'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation, Link } from 'react-router'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import FaunaL2Ordnungen from './faunaL2Ordnungen.js'
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
    faunaL1Klasse: React.PropTypes.string
  },

  getInitialState () {
    console.log('faunaL1Klassen: getInitialState called')
    console.log('faunaL1Klassen: this.props:', this.props)
    console.log('faunaL1Klassen: this.state:', this.state)
    const params = this.getParams()
    return {
      loading: !window.faunaStore.loaded,
      items: window.faunaStore.getInitialState(),
      faunaL1Klasse: params && params.faunaL1Klasse ? params.faunaL1Klasse : ''
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

  onClickNode (faunaL1Klasse) {
    this.setState({faunaL1Klasse: faunaL1Klasse})
    window.router.transitionTo(`/Fauna/${faunaL1Klasse}`)
  },

  render () {
    let nodes
    let tree
    let loadingMessage
    const items = this.state.items
    const faunaL1Klasse = this.state.faunaL1Klasse

    console.log('faunaL1Klassen: render called')
    console.log('faunaL1Klassen: items:', items)

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
          <li key={pair[0]}>
            <Link to='FaunaL2Ordnungen' params={{ 'faunaL1Klasse': pair[0] }}>
              <div
                className={pair[0] === faunaL1Klasse ? 'active' : null}
              >
                {pair[0]} ({pair[1]})
              </div>
              {pair[0] === faunaL1Klasse ? <FaunaL2Ordnungen/> : null}
            </Link>
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
