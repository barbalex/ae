/*
 * needs this information to load:
 * - fauna-objects from the faunaStore (props)
 * - if/which node/object is active (state)
 *   represented by an object consisting of:
 *   {1_klasse, 2_ordnung, 3_familie, 4_id}
 */
'use strict'

import React from 'react'
import _ from 'underscore'

export default React.createClass({
  displayName: 'Tree',

  propTypes: {
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  },

  getInitialState () {
    return {
      
    }
  },

  onClickNode () {
    // get level of clicked node

    // get next level for clicked node

    // if level 4 render form
  },

  render () {
    const level = this.props.level
    let arrayOfKlasseNumPairs
    let treeObjects

    switch (level) {
    case 1:
      arrayOfKlasseNumPairs = _.chain(this.props.data)
        .countBy(function (object) {
          if (object.Taxonomie && object.Taxonomie.Eigenschaften && object.Taxonomie.Eigenschaften.Klasse) {
            return object.Taxonomie.Eigenschaften.Klasse
          }
        })
        .pairs()
        .sortBy(function (pair) {
          return pair[0]
        })
        .value()

      /*const objKlassesNumbers = _.countBy(this.props.data, function (object) {
        if (object.Taxonomie && object.Taxonomie.Eigenschaften && object.Taxonomie.Eigenschaften.Klasse) {
          return object.Taxonomie.Eigenschaften.Klasse
        }
      })
      const klassesNumbersPairs = _.pairs(objKlassesNumbers)
      const klassesNumbersPairsSorted = _.sortBy(klassesNumbersPairs, function (pair) {
        return pair[0]
      })

      console.log('objKlassesNumbers:', objKlassesNumbers)
      console.log('klassesNumbersPairs:', klassesNumbersPairs)
      console.log('klassesNumbersPairsSorted:', klassesNumbersPairsSorted)*/

      treeObjects = arrayOfKlasseNumPairs.map(function (pair) {
          return (
            <p key={pair[0]}>{pair[0]} ({pair[1]})</p>
          )
        })
      break
    }
    return (
      <div className='baum'>
        {treeObjects}
      </div>
    )
  }
})
