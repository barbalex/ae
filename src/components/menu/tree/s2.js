'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Link } from 'react-router'
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
    loading: React.PropTypes.bool,
    items: React.PropTypes.object,
    s1: React.PropTypes.string,
    s2: React.PropTypes.string,
    s3: React.PropTypes.string
  },

  getInitialState () {
    const params = this.getParams()
    return {
      loading: !window.faunaStore.loaded,
      items: window.faunaStore.getInitialState(),
      s1: params.s1,
      s2: params.s2,
      s3: params.s3
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
    this.setState({s3: s3})
    const url = `/${this.state.s1}/${this.state.s2}/${s3}`
    console.log('s2: url', url)
    app.router.transitionTo(url)
  },

  render () {
    let nodes
    const that = this
    const items = this.state.items
    const s1 = this.state.s1
    const s2 = this.state.s2
    const s3 = this.state.s3

    // items nach S2 filtern (in Fauna: Klasse)
    const itemsWithS2 = _.pick(items, function (item) {
      if (item.Taxonomie && item.Taxonomie.Eigenschaften && item.Taxonomie.Eigenschaften.Klasse && item.Taxonomie.Eigenschaften.Klasse === s2) {
        return true
      }
    })

    nodes = _.chain(itemsWithS2)
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
        return (
          <li key={pair[0]} onClick={that.onClickNode.bind(that, pair[0])}>
            {pair[0]} ({pair[1]})
            {pair[0] === s3 ? <S3/> : null}
          </li>
        )
        /*return (
          <li key={pair[0]}>
            <Link to='s3' params={{s1: s1, s2: s2, s3: pair[0]}}>
              {pair[0]} ({pair[1]})
              {pair[0] === s3 ? <S3/> : null}
            </Link>
          </li>
        )*/
      })
      .value()

    return (
      <ul className='level2'>
        {nodes}
      </ul>
    )
  }
})
