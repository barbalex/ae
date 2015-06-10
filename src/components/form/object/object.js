'use strict'

import app from 'ampersand-app'
import React from 'react'
// import _ from 'underscore'
import Eigenschaftensammlung from './eigenschaftensammlung.js'

export default React.createClass({
  displayName: 'Object',

  getInitialState () {
    // have guid
    // need the object

    return {
      // ??
    }
  },

  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  componentDidMount () {
    // get's handed the guid from react-router
    const guid = this.props.param.guid
    // start listening to the store
    this.unsubscribe = window.faunaStore.listen(this.onFaunaStoreChange)
  },

  componentWillUnmount () {
    this.unsubscribe
  },

  render () {
    const object = this.props.object
    /*let objektBs = []  // regular property collections
    let taxBs = [] // taxonomic property collections
    let bsNamen
    // let guidsOfSynonyms
    // divide property collections in regular and taxonomic
    if (object.Beziehungssammlungen.length > 0) {
      _.each(object.Beziehungssammlungen, function (bs) {
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
            <Eigenschaftensammlung esTyp='Taxonomie' object={object} eigenschaftensammlung={object.Name}/>
            {/*taxonomischeBeziehungssammlungen*/}

          </div>
        </form>
      </fieldset>
    )
  }
})
