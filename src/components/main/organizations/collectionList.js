'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'UsersList',

  propTypes: {
    collections: React.PropTypes.array,
    cType: React.PropTypes.string,
    orgName: React.PropTypes.string
  },

  collections () {
    let { collections } = this.props
    collections.sort((a, b) => {
      if (a.name > b.name) return 1
      return -1
    })
    return collections.map((collection, index) => (
      <li key={index}>
        <p>{collection.name}</p>
      </li>
    ))
  },

  render () {
    const { cType, orgName } = this.props
    const title = `${cType} von ${orgName}`
    const titleStyle = {
      marginBottom: 0,
      marginTop: 15,
      fontWeight: 700
    }

    return (
      <div>
        <p style={titleStyle}>{title}</p>
        <div className='orgCollectionList'>
          <ul>
            {this.collections()}
          </ul>
        </div>
      </div>
    )
  }
})
