import React from 'react'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  title: {
    marginBottom: 0,
    marginTop: 15,
    fontWeight: 700
  },
  cList: {
    marginTop: 5,
    columnWidth: 400
  },
  cListUl: {
    paddingLeft: 20
  },
  cListP: {
    breakInside: 'avoid'
  }
})

const collectionsList = (collections) => {
  collections.sort((a, b) => {
    if (a.name > b.name) return 1
    return -1
  })
  return collections.map((collection, index) =>
    <li key={index}>
      <p className={css(styles.cListP)}>
        {collection.name}
      </p>
    </li>
  )
}

const CollectionList = ({ cType, collections }) =>
  <div>
    <p className={css(styles.title)}>
      {cType}
    </p>
    <div className={css(styles.cList)}>
      <ul className={css(styles.cListUl)}>
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
