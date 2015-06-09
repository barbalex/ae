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

  propTypes: {
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  },

  onClickNode () {
    // get level of clicked node

    // get next level for clicked node

    // if level 4 render form
  },

  render () {
    const objects = this.props.data
      .map(function (object) {
        return (
          <p key={object._id}>{object.Taxonomie.Eigenschaften['Artname vollständig']}</p>
        )
      })
    return (
      <div className='baum'>
        {objects}
      </div>
    )
  }
})
