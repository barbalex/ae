'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State } from 'react-router'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'

export default React.createClass({
  displayName: 'TreeLevel4',

  // ListenerMixin provides the listenTo method for the React component,
  // that works much like the one found in the Reflux's stores,
  // and handles the listeners during mount and unmount for you.
  // You also get the same listenToMany method as the store has.
  mixins: [ListenerMixin, State],

  propTypes: {
    loading: React.PropTypes.bool,
    items: React.PropTypes.object,
    s1: React.PropTypes.string,
    s2: React.PropTypes.string,
    s3: React.PropTypes.string,
    s4: React.PropTypes.string,
    s5: React.PropTypes.string  // in Fauna guid
  },

  getInitialState () {
    const params = this.getParams()
    return {
      loading: !window.faunaStore.loaded,
      items: window.faunaStore.getInitialState(),
      s1: params.s1,
      s2: params.s2,
      s3: params.s3,
      s4: params.s4,
      s5: params.s5  // in Fauna guid
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

  onClickNode (s5) {
    this.setState({s5: s5})
    const url = `/${this.state.s1}/${this.state.s2}/${this.state.s3}/${this.state.s4}/${s5}`
    window.router.transitionTo(url)
  },

  render () {
    let nodes
    const that = this
    const items = this.state.items
    const s2 = this.state.s2
    const s3 = this.state.s3
    const s4 = this.state.s4
    const s5 = this.state.s5

    // items nach s2, s3 und s4 filtern (in Fauna: Klasse, Ordnung und Familie)
    const itemsWithS4 = _.pick(items, function (item) {
      if (item.Taxonomie && item.Taxonomie.Eigenschaften && item.Taxonomie.Eigenschaften.Klasse && item.Taxonomie.Eigenschaften.Klasse === s2 && item.Taxonomie.Eigenschaften.Ordnung && item.Taxonomie.Eigenschaften.Ordnung === s3 && item.Taxonomie.Eigenschaften.Familie && item.Taxonomie.Eigenschaften.Familie === s4) {
        return true
      }
    })

    console.log('s4: itemsWithS4', itemsWithS4)

    nodes = _.chain(itemsWithS4)
      // make an object {ordnung1: num, ordnung2: num}
      .countBy(function (item) {
        if (item.Taxonomie.Eigenschaften['Artname vollständig']) {
          return item.Taxonomie.Eigenschaften['Artname vollständig']
        }
      })
      // convert to array of arrays so it can be sorted
      .pairs()
      .sortBy(function (pair) {
        return pair[0]
      })
      // map to needed elements
      .map(function (pair) {
        return (
          <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
            {pair[0]} ({pair[1]})
            {/*pair[0] === s5 ? <S5/> : null*/}
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
