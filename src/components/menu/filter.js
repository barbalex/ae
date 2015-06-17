/*
 * gets all objects
 * builds an array of objects needed by the filter component to create the list of filterable objects
 * returns the filter component
 */
'use strict'

import app from 'ampersand-app'
import React from 'react'
import Filter from 'react-select'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import values from 'lodash/object/values'

export default React.createClass({
  displayName: 'Filter',

  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    items: React.PropTypes.object,
    gruppe: React.PropTypes.string
  },

  getInitialState () {
    const params = this.getParams()
    const gruppe = params.gruppe || 'Fauna'
    return {
      loading: !window.objectStore.loaded,
      items: window.objectStore.getItemsOfGruppe(gruppe),
      gruppe: gruppe
    }
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
    // loadObjectStore if necessary
    if (!window.objectStore.loaded) app.Actions.loadObjectStore(this.state.gruppe)
  },

  onStoreChange (items) {
    this.setState({
      loading: false,
      items: items[this.state.gruppe]
    })
  },

  filter (guid) {
    const gruppe = this.state.gruppe
    const objekt = window.objectStore.getItem(gruppe, guid)
    const klasse = objekt.Taxonomie.Eigenschaften.Klasse
    const ordnung = objekt.Taxonomie.Eigenschaften.Ordnung
    const familie = objekt.Taxonomie.Eigenschaften.Familie
    window.router.transitionTo(`/Fauna/${klasse}/${ordnung}/${familie}/${guid}`)
    this.forceUpdate()
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
