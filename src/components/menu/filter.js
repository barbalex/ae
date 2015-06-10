/*
 * gets all objects
 * builds an array of objects needed by the filter component to create the list of filterable objects
 * returns the filter component
 */
'use strict'

import app from 'ampersand-app'
import React from 'react'
import Filter from 'react-select'

export default React.createClass({
  displayName: 'Filter',

  propTypes: {
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  },

  filter (val) {
    console.log('filtered:', val)
    app.Actions.showFauna(val)
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
