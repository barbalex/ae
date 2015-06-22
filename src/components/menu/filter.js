/*
 * gets all objects
 * builds an array of objects needed by the filter component to create the list of filterable objects
 * returns the filter component
 */
'use strict'

import React from 'react'
import { Typeahead } from 'react-typeahead'
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
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const gruppe = path[0]
    return {
      loading: !window.objectStore.loaded[gruppe],
      items: window.objectStore.getItems(),
      gruppe: gruppe
    }
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
  },

  onStoreChange (items) {
    this.setState({
      loading: false,
      items: items
    })
  },

  filter (guid) {

    console.log('filter.js: object filtered:', guid)
    /*const gruppe = this.state.gruppe
    const objekt = window.objectStore.getItem(gruppe, guid)
    const klasse = objekt.Taxonomie.Eigenschaften.Klasse
    const ordnung = objekt.Taxonomie.Eigenschaften.Ordnung
    const familie = objekt.Taxonomie.Eigenschaften.Familie
    window.router.transitionTo(`/Fauna/${klasse}/${ordnung}/${familie}/${guid}`)
    this.forceUpdate()*/
  },

  render () {
    let options = []

    // get all keys of groups
    _.forEach(this.state.items, function (value, key) {
      // value is an object with key = guid for all lr-objects
      // _.values(value) is an array of all objects
      const objectArray = _.values(value)

      const groupOptions = _.map(objectArray, function (object) {
        // make sure every fauna has a name
        // dont use others for filtering
        if (object.Taxonomie && object.Taxonomie.Eigenschaften && object.Taxonomie.Eigenschaften['Artname vollständig']) {
          return {
            'value': object._id,
            'label': object.Taxonomie.Eigenschaften['Artname vollständig']
          }
        }
      })
      // add the options of this gruppe to all options
      options = options.concat(groupOptions)
    })

    console.log('filter.js: options:', options)
    console.log('filter.js: options.length:', options.length)

    const filter = (
      <Typeahead
        placeholder={'filtern'}
        maxVisible={20}
        options={options}
        filterOption={'label'}
        displayOption={'label'}
        onOptionSelected={this.filter}/>
    )

    const nothing = <div/>

    return (
      <div id='filter'>
        {this.state.loading ? nothing : filter}
      </div>
    )
  }
})
