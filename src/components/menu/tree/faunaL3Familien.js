'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import FaunaL4Arten from './faunaL4Arten.js'

export default React.createClass({
  displayName: 'TreeLevel3',

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
    faunaL4Art: React.PropTypes.string
  },

  getInitialState () {
    // console.log('faunaL3Familien getInitialState called')
    const params = this.getParams()
    return {
      loading: !window.objectStore.loaded,
      items: window.objectStore.getItemsOfGruppe('Fauna'),
      faunaL2Ordnung: params.faunaL2Ordnung,
      faunaL3Familie: params.faunaL3Familie,
      faunaL4Art: params.faunaL4Art
    }
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
    // loadObjectStore if necessary
    if (!window.objectStore.loaded) app.Actions.loadObjectStore('Fauna')
  },

  onStoreChange (items) {
    console.log('faunaL3Familien.js: store has changed, items:', items['Fauna'])
    this.setState({
      loading: false,
      items: items['Fauna']
    })
  },

  onClickNode (faunaL4Art, event) {
    event.stopPropagation()
    this.setState({faunaL4Art: faunaL4Art})
    const url = `/Fauna/${this.state.faunaL2Ordnung}/${this.state.faunaL3Familie}/${faunaL4Art}`
    window.router.transitionTo(url)
  },

  render () {
    let nodes
    const that = this
    const items = this.state.items
    const faunaL2Ordnung = this.state.faunaL2Ordnung
    const faunaL3Familie = this.state.faunaL3Familie
    const faunaL4Art = this.state.faunaL4Art

    // items nach FaunaL2Ordnungen und FaunaL3Familien filtern (in Fauna Klasse und Ordnung)
    const itemsWithS3 = _.pick(items, function (item) {
      if (item.Taxonomie && item.Taxonomie.Eigenschaften && item.Taxonomie.Eigenschaften.Klasse && item.Taxonomie.Eigenschaften.Klasse === faunaL2Ordnung && item.Taxonomie.Eigenschaften.Ordnung && item.Taxonomie.Eigenschaften.Ordnung === faunaL3Familie) {
        return true
      }
    })

    nodes = _.chain(itemsWithS3)
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
      // div arount Text is for interacting wich the li element
      .map(function (pair) {
        return (
          <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
            <div
              className={pair[0] === faunaL4Art ? 'active' : null}
            >
              {pair[0]} ({pair[1]})
            </div>
            {pair[0] === faunaL4Art ? <FaunaL4Arten/> : null}
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
