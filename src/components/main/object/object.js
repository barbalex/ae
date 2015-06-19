'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State } from 'react-router'
import { ListenerMixin } from 'reflux'
import Inspector from 'react-json-inspector'
import _ from 'lodash'
import Eigenschaftensammlung from './eigenschaftensammlung.js'
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
    const path = pathString.split('/')
    const gruppe = path[0]
    const lastPathElement = path[path.length - 1]
    const guid = this.props.guid || (isGuid(lastPathElement) ? lastPathElement : null)
    const item = guid ? window.objectStore.getItem(gruppe, guid) : null

    console.log('object.js: gruppe', gruppe)
    console.log('object.js: guid', guid)
    console.log('object.js: item', item)

    return {
      loading: !window.objectStore.loaded[gruppe],
      item: item,
      gruppe: gruppe,
      guid: guid
    }
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
    // loadObjectStore if necessary
    if (!window.objectStore.loaded[this.state.gruppe]) app.Actions.loadObjectStore(this.state.gruppe)
  },

  onStoreChange (items, hierarchyObject) {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const gruppe = path[0]
    const lastPathElement = path[path.length - 1]
    const guid = isGuid(lastPathElement) ? lastPathElement : null
    const item = guid ? window.objectStore.getItem(gruppe, guid) : null
    this.setState({
      loading: !window.objectStore.loaded[gruppe],
      item: item,
      gruppe: gruppe,
      guid: guid
    })
  },

  render () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const gruppe = path[0]
    const lastPathElement = path[path.length - 1]
    const guid = isGuid(lastPathElement) ? lastPathElement : null
    const item = window.objectStore.getItem(gruppe, guid)

    if (!guid) {
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

    /*let objektBs = []  // regular property collections
    let taxBs = [] // taxonomic property collections
    let bsNamen
    // let guidsOfSynonyms
    // divide property collections in regular and taxonomic
    if (object.Beziehungssammlungen.length > 0) {
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
    }*/
    // add taxonomic property collections
    // want defined order
    /*if (taxBs.length > 0) {

    }*/
    return (
      <fieldset id='main'>
        <form className='form form-horizontal' autoComplete='off'>
          <div id='formContent'>
            {/*<h4>Taxonomie:</h4>*/}
            <Inspector data={item}/>
            {/*<Eigenschaftensammlung esTyp='Taxonomie' object={object} eigenschaftensammlung={object.Name}/>*/}
            {/*taxonomischeBeziehungssammlungen*/}

          </div>
        </form>
      </fieldset>
    )
  }
})
