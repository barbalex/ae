'use strict'

import app from 'ampersand-app'
import React from 'react'
import Router from 'react-router'
import { ListenerMixin } from 'reflux'
import forEach from 'lodash/collection/foreach'
import Eigenschaftensammlung from './eigenschaftensammlung.js'

export default React.createClass({
  displayName: 'Object',

  mixins: [ListenerMixin, Router.State],

  getInitialState () {
    // const store = this.getStore()
    // const items = store.getInitialState().items

    console.log('object: getParams:', this.getParams())
    console.log('object: getRoutes:', this.getRoutes())
    console.log('object: getQuery:', this.getQuery())

    return {
      /*loading: !store.getInitialState().items,
      items: items*/
    }
  },

  propTypes: {
    // param: React.PropTypes.object.isRequired
  },

  componentDidMount () {
    /*const store = this.getStore()
    this.listenTo(store, this.handleLoadItemsComplete)
    if (!store.get(this.props.param.guid)) {
      this.getItem()
    }*/
  },

  getStore () {
    // return window[this.props.param.gruppe + 'Store']
  },

  getGuid () {
    // return this.props.param.guid
  },

  getItem () {
    this.setState({ loading: true}, () => {
      // app.Actions.loadFaunaStore(this.props.param.guid)
    })
  },

  handleLoadItemsComplete (items) {
    this.setState({
      loading: false,
      items: items
    })
  },

  render () {
    if (this.state.loading) {
      return <p>Lade Daten...</p>
    }

    /*let objektBs = []  // regular property collections
    let taxBs = [] // taxonomic property collections
    let bsNamen
    // let guidsOfSynonyms
    // divide property collections in regular and taxonomic
    if (object.Beziehungssammlungen.length > 0) {
      forEach(object.Beziehungssammlungen, function (bs) {
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
      <fieldset id='forms'>
        <form className='form form-horizontal' autoComplete='off'>
          <div id='formContent'>
            <h4>Taxonomie:</h4>
            {/*<Eigenschaftensammlung esTyp='Taxonomie' object={object} eigenschaftensammlung={object.Name}/>*/}
            {/*taxonomischeBeziehungssammlungen*/}

          </div>
        </form>
      </fieldset>
    )
  }
})
