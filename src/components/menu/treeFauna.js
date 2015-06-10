/*
 * needs this information to load:
 * - fauna-objects from the faunaStore (props)
 * - if/which node/object is active (state)
 *   represented by an object consisting of:
 *   {1_klasse, 2_ordnung, 3_familie, 4_id}
 */
'use strict'

import React from 'react'
import chain from 'lodash/chain/chain'

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
    let level1Nodes
    let level1LiNodes

    switch (level) {
    case 1:
      level1LiNodes = chain(this.props.data)
      // make an object {klasse1: num, klasse2: num}
        .countBy(function (object) {
          if (object.Taxonomie && object.Taxonomie.Eigenschaften && object.Taxonomie.Eigenschaften.Klasse) {
            return object.Taxonomie.Eigenschaften.Klasse
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
            <li key={pair[0]}>{pair[0]} ({pair[1]})</li>
          )
        })
        .value()
      level1Nodes = (
        <ul className='level0'>
          {level1LiNodes}
        </ul>
      )
      break
    }
    return (
      <div className='baum'>
        {level1Nodes}
      </div>
    )
  }
})
