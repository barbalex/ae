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
      <div>
        <div id='treeMitteilung' style={{display: 'none'}}>hole Daten...</div>
        <div className='treeBeschriftung'></div>
        <div className='baum'></div>
      </div>
    )
  }
})
