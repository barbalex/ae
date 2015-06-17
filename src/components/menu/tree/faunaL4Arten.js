'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'

export default React.createClass({
  displayName: 'TreeLevel4',

  // ListenerMixin provides the listenTo method for the React component,
  // that works much like the one found in the Reflux's stores,
  // and handles the listeners during mount and unmount for you.
  // You also get the same listenToMany method as the store has.
  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    loading: React.PropTypes.bool,
    items: React.PropTypes.object,
    faunaL2Ordnung: React.PropTypes.string,
    faunaL3Familie: React.PropTypes.string,
    faunaL4Art: React.PropTypes.string,
    faunaL5Objekt: React.PropTypes.string  // in Fauna guid
  },

  getInitialState () {
    // console.log('faunaL4Arten: getInitialState called')
    const params = this.getParams()
    return {
      loading: !window.objectStore.loaded,
      items: window.objectStore.getItemsOfGruppe('Fauna'),
      faunaL2Ordnung: params.faunaL2Ordnung,
      faunaL3Familie: params.faunaL3Familie,
      faunaL4Art: params.faunaL4Art,
      faunaL5Objekt: params.faunaL5Objekt  // in Fauna guid
    }
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
    // loadObjectStore if necessary
    if (!window.objectStore.loaded) app.Actions.loadObjectStore('Fauna')
  },

  onStoreChange (items) {
    this.setState({
      loading: false,
      items: items['Fauna']
    })
  },

  onClickNode (faunaL5Objekt, event) {
    event.stopPropagation()
    this.setState({faunaL5Objekt: faunaL5Objekt})
    const url = `/Fauna/${this.state.faunaL2Ordnung}/${this.state.faunaL3Familie}/${this.state.faunaL4Art}/${faunaL5Objekt}`
    window.router.transitionTo(url)
  },

  render () {
    let nodes
    const that = this
    const items = this.state.items
    const faunaL2Ordnung = this.state.faunaL2Ordnung
    const faunaL3Familie = this.state.faunaL3Familie
    const faunaL4Art = this.state.faunaL4Art
    const faunaL5Objekt = this.state.faunaL5Objekt

    // items nach faunaL2Ordnung, faunaL3Familie und faunaL4Art filtern (in Fauna: Klasse, Ordnung und Familie)
    const itemsWithS4 = _.pick(items, function (item) {
      if (item.Taxonomie && item.Taxonomie.Eigenschaften && item.Taxonomie.Eigenschaften.Klasse && item.Taxonomie.Eigenschaften.Klasse === faunaL2Ordnung && item.Taxonomie.Eigenschaften.Ordnung && item.Taxonomie.Eigenschaften.Ordnung === faunaL3Familie && item.Taxonomie.Eigenschaften.Familie && item.Taxonomie.Eigenschaften.Familie === faunaL4Art) {
        return true
      }
    })

    nodes = _.chain(itemsWithS4)
      // make an object {ordnung1: num, ordnung2: num}
      .map(function (item) {
        if (item.Taxonomie.Eigenschaften['Artname vollständig']) {
          return [item._id, item.Taxonomie.Eigenschaften['Artname vollständig']]
        }
      })
      .sortBy(function (pair) {
        return pair[1]
      })
      // map to needed elements
      // div arount Text is for interacting wich the li element
      .map(function (pair) {
        return (
          <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
            <div
              className={pair[0] === faunaL5Objekt ? 'active' : null}
            >
              {pair[1]}
            </div>
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
