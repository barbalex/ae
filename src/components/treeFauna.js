/*
 * needs this information to load:
 * - fauna-objects from the faunaStore (props)
 * - if/which node/object is active (state)
 *   represented by an object consisting of:
 *   {1_klasse, 2_ordnung, 3_familie, 4_id}
 */
'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'Tree',

  getInitialState () {
    return {
      // build level 1 nodes
    }
  },

  onClickNode () {
    // get level of clicked node

    // get next level for clicked node

    // if level 4 render form
  },

  render () {
    return (
      <div className='baum'>
        <p>This should be a tree</p>
      </div>
    )
  }
})
