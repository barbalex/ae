'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation } from 'react-router'
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
    faunaL2Ordnung: React.PropTypes.string
  },

  getInitialState () {
    // console.log('treeFauna getInitialState called')
    const params = this.getParams()
    return {
      loading: !window.objectStore.loaded,
      items: window.objectStore.getItemsOfGruppe('Fauna'),
      faunaL2Ordnung: params.faunaL2Ordnung
    }
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
    // loadObjectStore if necessary
    if (!window.objectStore.loaded) app.Actions.loadObjectStore('Fauna')
  },

  onStoreChange (items) {
    console.log('faunaL1Klassen.js: store has changed, items:', items['Fauna'])
    this.setState({
      loading: false,
      items: items['Fauna']
    })
  },

  onClickNode (faunaL2Ordnung) {
    this.setState({faunaL2Ordnung: faunaL2Ordnung})
    window.router.transitionTo(`/Fauna/${faunaL2Ordnung}`)
  },

  render () {
    let nodes
    let tree
    let loadingMessage
    const that = this
    const items = this.state.items
    const faunaL2Ordnung = this.state.faunaL2Ordnung

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
          <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
            <div
              className={pair[0] === faunaL2Ordnung ? 'active' : null}
            >
              {pair[0]} ({pair[1]})
            </div>
            {pair[0] === faunaL2Ordnung ? <FaunaL2Ordnungen/> : null}
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
