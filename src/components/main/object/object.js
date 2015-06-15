'use strict'

import app from 'ampersand-app'
import React from 'react'
import Router from 'react-router'
import { ListenerMixin } from 'reflux'
import Inspector from 'react-json-inspector'
import _ from 'lodash'
import Eigenschaftensammlung from './eigenschaftensammlung.js'
// const router = window.router

export default React.createClass({
  displayName: 'Object',

  // ListenerMixin provides the listenTo method for the React component,
  // that works much like the one found in the Reflux's stores,
  // and handles the listeners during mount and unmount for you.
  // You also get the same listenToMany method as the store has.
  mixins: [ListenerMixin, Router.State],

  propTypes: {
    loading: React.PropTypes.bool,
    items: React.PropTypes.object,
    faunaL2Ordnung: React.PropTypes.string,
    faunaL3Familie: React.PropTypes.string,
    faunaL4Art: React.PropTypes.string,
    faunaL5Objekt: React.PropTypes.string  // in Fauna guid
  },

  getInitialState () {
    const params = this.getParams()
    console.log('object: faunaL5Objekt:', this.props.faunaL5Objekt)
    return {
      loading: !window.faunaStore.loaded,
      items: this.props.items ? this.props.items : window.faunaStore.getInitialState(),
      faunaL2Ordnung: this.props.faunaL2Ordnung ? this.props.faunaL2Ordnung : params.faunaL2Ordnung,
      faunaL3Familie: this.props.faunaL3Familie ? this.props.faunaL3Familie : params.faunaL3Familie,
      faunaL4Art: this.props.faunaL4Art ? this.props.faunaL4Art : params.faunaL4Art,
      faunaL5Objekt: this.props.faunaL5Objekt ? this.props.faunaL5Objekt : params.faunaL5Objekt  // in Fauna guid
    }
  },

  componentDidMount () {
    this.listenTo(window.faunaStore, this.onStoreChange)
    // loadFaunaStore if necessary
    if (!window.faunaStore.loaded) app.Actions.loadFaunaStore()
  },

  onStoreChange (items) {
    this.setState({
      loading: false,
      items: items
    })
  },

  render () {
    const items = this.state.items
    const faunaL5Objekt = this.state.faunaL5Objekt
    console.log('object: faunaL5Objekt:', faunaL5Objekt)
    console.log('object: items[faunaL5Objekt]', items[faunaL5Objekt])
    if (this.state.loading) {
      return (
        <p>Lade Daten...</p>
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
      <form className='form form-horizontal' autoComplete='off'>
        <div id='formContent'>
          {/*<h4>Taxonomie:</h4>*/}
          <Inspector data={items[faunaL5Objekt]}/>
          {/*<Eigenschaftensammlung esTyp='Taxonomie' object={object} eigenschaftensammlung={object.Name}/>*/}
          {/*taxonomischeBeziehungssammlungen*/}

        </div>
      </form>
    )
  }
})
