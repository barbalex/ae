/*
 * gets all objects
 * builds an array of objects needed by the filter component to create the list of filterable objects
 * returns the filter component
 */
'use strict'

import app from 'ampersand-app'
import React from 'react'
import Filter from 'react-select'
import { State } from 'react-router'
import { ListenerMixin } from 'reflux'
import values from 'lodash/object/values'

export default React.createClass({
  displayName: 'Filter',

  mixins: [ListenerMixin, State],

  propTypes: {
    items: React.PropTypes.object.isRequired
  },

  getInitialState () {
    return {
      loading: !window.faunaStore.loaded,
      items: window.faunaStore.getInitialState()
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

  filter (guid) {
    const objekt = window.faunaStore.get(guid)
    const klasse = objekt.Taxonomie.Eigenschaften.Klasse
    const ordnung = objekt.Taxonomie.Eigenschaften.Ordnung
    const familie = objekt.Taxonomie.Eigenschaften.Familie
    window.router.transitionTo(`/Fauna/${klasse}/${ordnung}/${familie}/${guid}`)
  },

  render () {
    const objects = values(this.state.items)
      .map(function (object) {
        // make sure every fauna has a name
        // dont use others for filtering
        if (object.Taxonomie && object.Taxonomie.Eigenschaften && object.Taxonomie.Eigenschaften['Artname vollständig']) {
          return {
            value: object._id,
            label: object.Taxonomie.Eigenschaften['Artname vollständig']
          }
        }
      })

    const filter = (
      <Filter
        placeholder='filtern'
        noResultsText='keine Treffer'
        options={objects}
        onChange={this.filter}/>
    )

    const nothing = <div/>

    return (
      <div id='filter'>
        {this.state.loading ? nothing : filter}
      </div>
    )
  }
})
