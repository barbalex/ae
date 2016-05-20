'use strict'

import React from 'react'

const collectionsList = (collections) => {
  collections.sort((a, b) => {
    if (a.name > b.name) return 1
    return -1
  })
  return collections.map((collection, index) => (
    <li key={index}>
      <p>{collection.name}</p>
    </li>
  ))
}

const titleStyle = {
  marginBottom: 0,
  marginTop: 15,
  fontWeight: 700
}

const CollectionList = ({ cType, collections }) =>
  <div>
    <p style={titleStyle}>
      {cType}
    </p>
    <div className="orgCollectionList">
      <ul>
        {collectionsList(collections)}
      </ul>
    </div>
  </div>

CollectionList.displayName = 'CollectionList'

CollectionList.propTypes = {
  collections: React.PropTypes.array,
  cType: React.PropTypes.string,
  orgName: React.PropTypes.string
}

export default CollectionList
