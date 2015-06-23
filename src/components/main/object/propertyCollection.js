'use strict'

import React from 'react'
import { State } from 'react-router'

export default function (propertyCollectionType, object, propertyCollection) {
  return React.createClass({
    displayName: 'PropertyCollectionDescription',

    mixins: [State],

    propTypes: {
      propertyCollectionType: React.PropTypes.string,
      object: React.PropTypes.object,
      propertyCollection: React.PropTypes.object
    },

    getInitialState () {
      return {
        propertyCollectionType: propertyCollectionType,
        object: object,
        propertyCollection: propertyCollection
      }
    },

    render () {
      return (
        <p>Eigenschaftensammlung für GUID {this.props.object._id}</p>
      )
    }
  })
}
