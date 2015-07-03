'use strict'

// import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
// import Inspector from 'react-json-inspector'
import _ from 'lodash'
import PropertyCollection from './propertyCollection.js'
import RelationCollection from './relationCollection.js'

export default React.createClass({
  displayName: 'Object',

  mixins: [ListenerMixin],

  propTypes: {
    object: React.PropTypes.object
  },

  onPathStoreChange (path) {
    this.forceUpdate()
  },

  onObjectStoreChange () {
    this.forceUpdate()
  },

  render () {
    const object = this.props.object

    console.log('object.js, render: object', object)
    console.log('object.js, render: this.props.object', this.props.object)

    if (!object || _.keys(object).length === 0) {
      return (
        <fieldset id='main'>
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

        // console.log('object.js, render: pc passed to PropertyCollection:', pc)

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
