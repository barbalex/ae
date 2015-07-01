'use strict'

// import app from 'ampersand-app'
import React from 'react'
import { State } from 'react-router'
import { ListenerMixin } from 'reflux'
// import Inspector from 'react-json-inspector'
import _ from 'lodash'
import PropertyCollection from './propertyCollection.js'
import RelationCollection from './relationCollection.js'
import isGuid from '../../../modules/isGuid.js'

export default React.createClass({
  displayName: 'Object',

  // ListenerMixin provides the listenTo method for the React component,
  // that works much like the one found in the Reflux's stores,
  // and handles the listeners during mount and unmount for you.
  // You also get the same listenToMany method as the store has.
  mixins: [ListenerMixin, State],

  propTypes: {
    loading: React.PropTypes.bool,
    item: React.PropTypes.object,
    gruppe: React.PropTypes.string,
    guid: React.PropTypes.string
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')// guidPath is when only a guid is contained in url
    const isGuidPath = path.length === 1 && isGuid(path[0])
    const gruppe = path[0]
    const lastPathElement = path[path.length - 1]
    const guid = isGuid(lastPathElement) ? lastPathElement : null
    const item = guid ? window.objectStore.getItem(gruppe, guid) : null
    const state = {
      loading: isGuidPath || !window.objectStore.loaded[gruppe],
      item: item,
      gruppe: gruppe,
      guid: guid
    }

    // console.log('object.js, getInitialState: state', state)

    return state
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
  },

  onStoreChange (items, hierarchyObject) {
    const pathString = this.getParams().splat
    const path = pathString.split('/')  // guidPath is when only a guid is contained in url
    const lastPathElement = path[path.length - 1]
    const guid = isGuid(lastPathElement) ? lastPathElement : null
    const gruppe = path[0]
    const item = guid ? window.objectStore.getItem(gruppe, guid) : null

    const isGuidPath = path.length === 1 && isGuid(path[0])
    this.setState({
      loading: isGuidPath || !window.objectStore.loaded[gruppe],
      item: item
    })
  },

  render () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const lastPathElement = path[path.length - 1]
    const guid = isGuid(lastPathElement) ? lastPathElement : null
    const gruppe = this.state.gruppe
    const object = window.objectStore.getItem(gruppe, guid)

    if (!object || !guid) {
      return (
        <fieldset id='main'>
        </fieldset>
      )
    }
    if (this.state.loading) {
      return (
        <fieldset id='main'>
          <p>Lade Daten...</p>
        </fieldset>
      )
    }

    let objektBs = []  // regular property collections
    let taxBs = [] // taxonomic property collections
    let bsNamen = []
    // let guidsOfSynonyms
    // divide property collections in regular and taxonomic
    if (object.Beziehungssammlungen && object.Beziehungssammlungen.length > 0) {
      _.forEach(object.Beziehungssammlungen, function (bs) {
        if (bs.Typ === 'taxonomisch') {
          taxBs.push(bs)
        } else {
          objektBs.push(bs)
        }
        // list names of property collections
        // later it will be necessary to check if a property collection is already shown
        bsNamen.push(bs.Name)
      })
    }

    // add taxonomic property collections
    // want defined order
    if (taxBs.length > 0) {

    }

    // add property collections
    let propertyCollections = null
    if (object.Eigenschaftensammlungen && object.Eigenschaftensammlungen.length > 0) {
      const pcs = _.map(object.Eigenschaftensammlungen, function (pc) {

        console.log('object.js, render: pc passed to PropertyCollection:', pc)

        return <PropertyCollection key={pc.Name} pcType='Datensammlung' object={object} propertyCollection={pc}/>
      })
      propertyCollections = (
        <div>
          <h4>Eigenschaften:</h4>
          {pcs}
        </div>
      )
    }

    // add relation collections
    let relationCollections = null
    if (objektBs.length > 0) {
      const rcs = _.map(objektBs, function (rc) {
        return <RelationCollection key={rc.Name} object={object} relationCollection={rc} />
      })
      relationCollections = (
        <div>
          <h4>Beziehungen:</h4>
          {rcs}
        </div>
      )
    }

    console.log('object.js, render: Taxonomie-pc passed to PropertyCollection:', object.Taxonomie)

    return (
      <fieldset id='main'>
        <form className='form form-horizontal' autoComplete='off'>
          <div id='formContent'>
            <h4>Taxonomie:</h4>
            {object.Taxonomie ? <PropertyCollection pcType='Taxonomie' object={object} propertyCollection={object.Taxonomie}/> : ''}
            {/*taxonomischeBeziehungssammlungen*/}
            {propertyCollections ? propertyCollections : ''}
            {relationCollections ? relationCollections : ''}
            {/*<Inspector data={object}/>*/}
          </div>
        </form>
      </fieldset>
    )
  }
})
