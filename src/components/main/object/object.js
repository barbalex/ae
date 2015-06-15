'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State } from 'react-router'
import { ListenerMixin } from 'reflux'
import Inspector from 'react-json-inspector'
import _ from 'lodash'
import Eigenschaftensammlung from './eigenschaftensammlung.js'

export default React.createClass({
  displayName: 'Object',

  // ListenerMixin provides the listenTo method for the React component,
  // that works much like the one found in the Reflux's stores,
  // and handles the listeners during mount and unmount for you.
  // You also get the same listenToMany method as the store has.
  mixins: [ListenerMixin, State],

  propTypes: {
    loading: React.PropTypes.bool,
    items: React.PropTypes.object,
    faunaL2Ordnung: React.PropTypes.string,
    faunaL3Familie: React.PropTypes.string,
    faunaL4Art: React.PropTypes.string,
    FaunaL5Objekt: React.PropTypes.string  // in Fauna guid
  },

  getInitialState () {
    const params = this.getParams()
    return {
      loading: !window.faunaStore.loaded,
      items: window.faunaStore.getInitialState(),
      faunaL2Ordnung: params.faunaL2Ordnung,
      faunaL3Familie: params.faunaL3Familie,
      faunaL4Art: params.faunaL4Art,
      FaunaL5Objekt: params.FaunaL5Objekt  // in Fauna guid
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
            <Inspector data={this.state.items[this.state.FaunaL5Objekt]}/>
            {/*<Eigenschaftensammlung esTyp='Taxonomie' object={object} eigenschaftensammlung={object.Name}/>*/}
            {/*taxonomischeBeziehungssammlungen*/}

          </div>
        </form>
      </fieldset>
    )
  }
})
