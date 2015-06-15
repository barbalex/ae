'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation, Link } from 'react-router'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import Objekt from '../../main/object/object.js'

export default React.createClass({
  displayName: 'FaunaL4Arten',

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
      loading: !window.faunaStore.loaded,
      items: this.props.items ? this.props.items : window.faunaStore.getInitialState(),
      faunaL2Ordnung: this.props.faunaL2Ordnung ? this.props.faunaL2Ordnung : params.faunaL2Ordnung,
      faunaL3Familie: this.props.faunaL3Familie ? this.props.faunaL3Familie : params.faunaL3Familie,
      faunaL4Art: this.props.faunaL4Art ? this.props.faunaL4Art : params.faunaL4Art,
      faunaL5Objekt: this.props.faunaL5Objekt ? this.props.faunaL5Objekt : params.faunaL5Objekt  // in Fauna guid
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

  onClickNode (faunaL5Objekt, event) {
    event.stopPropagation()
    this.setState({faunaL5Objekt: faunaL5Objekt})
    {/*const url = `/Fauna/${this.state.faunaL2Ordnung}/${this.state.faunaL3Familie}/${this.state.faunaL4Art}/${faunaL5Objekt}`
        window.router.transitionTo(url)*/}
    React.render(
      <Objekt
        items={this.state.items}
        faunaL2Ordnung={this.state.faunaL2Ordnung}
        faunaL3Familie={this.state.faunaL3Familie}
        faunaL4Art={this.state.faunaL4Art}
        faunaL5Objekt={faunaL5Objekt}/>,
      document.getElementById('main')
    )
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
        const url = `/Fauna/${faunaL2Ordnung}/${faunaL3Familie}/${faunaL4Art}/${pair[0]}`
        const params = {
          'faunaL2Ordnung': faunaL2Ordnung,
          'faunaL3Familie': faunaL3Familie,
          'faunaL4Art': faunaL4Art,
          'faunaL5Objekt': pair[0]
        }
        console.log('faunaL4Arten: params:', params)
        console.log('faunaL4Arten: faunaL5Objekt:', faunaL5Objekt)
        return (
          /*<li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
            <div
              className={pair[0] === faunaL5Objekt ? 'active' : null}
            >
              {pair[1]}
            </div>
          </li>*/
          <li key={pair[0]}>
            <Link to='faunaL5Objekt' params={params}>
              <div
                className={pair[0] === faunaL5Objekt ? 'active' : null}
              >
                {pair[1]}
              </div>
            </Link>
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
