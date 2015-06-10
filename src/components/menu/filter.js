/*
 * gets all objects
 * builds an array of objects needed by the filter component to create the list of filterable objects
 * returns the filter component
 */
'use strict'

import app from 'ampersand-app'
import React from 'react'
import Filter from 'react-select'
import _ from 'underscore'

export default React.createClass({
  displayName: 'Filter',

  propTypes: {
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  },

  filter (guid) {
    console.log('filtered:', guid)
    // get the object to pass
    const objectToPass = _.find(this.props.data, function (object) {
      return object._id === guid
    })

    console.log('app:', app)
    console.log('app.router:', app.router)

    window.router.transitionTo('/objekte/' + guid)
  },

  render () {
    const objects = this.props.data
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
