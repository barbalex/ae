/*
 * gets all objects
 * builds an array of objects needed by the filter component to create the list of filterable objects
 * returns the filter component
 */
'use strict'

import React from 'react'
import Filter from 'react-select'
import values from 'lodash/object/values'

export default React.createClass({
  displayName: 'Filter',

  propTypes: {
    items: React.PropTypes.object.isRequired
  },

  filter (guid) {
    const objekt = window.faunaStore.get(guid)
    const klasse = objekt.Taxonomie.Eigenschaften.Klasse
    const ordnung = objekt.Taxonomie.Eigenschaften.Ordnung
    const familie = objekt.Taxonomie.Eigenschaften.Familie
    window.router.transitionTo(`/fauna/${klasse}/${ordnung}/${familie}/${guid}`)
  },

  render () {
    const objects = values(this.props.items)
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

    return (
      <Filter
        placeholder='filtern'
        noResultsText='keine Treffer'
        options={objects}
        onChange={this.filter}/>
    )
  }
})
