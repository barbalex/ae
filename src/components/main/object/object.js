'use strict'

// import app from 'ampersand-app'
import React from 'react'
// import Inspector from 'react-json-inspector'
import _ from 'lodash'
import PropertyCollection from './propertyCollection.js'
import RelationCollection from './relationCollection.js'
import getGuidsOfSynonymsFromTaxonomicRcs from '../../../modules/getGuidsOfSynonymsFromTaxonomicRcs.js'

export default React.createClass({
  displayName: 'Object',

  propTypes: {
    object: React.PropTypes.object
  },

  getInitialState () {
    const formClassNames = window.innerWidth > 700 ? 'form form-horizontal' : 'form'
    console.log('object.js, getInitialState: window.innerWidth', window.innerWidth)
    console.log('object.js, getInitialState: formClassNames', formClassNames)
    return {
      formClassNames: formClassNames
    }
  },

  componentDidMount () {
    window.addEventListener('resize', this.onResize)
  },

  onResize () {
    const thisWidth = React.findDOMNode(this).offsetWidth
    const formClassNames = thisWidth > 700 ? 'form form-horizontal' : 'form'
    this.setState({
      formClassNames: formClassNames
    })
  },

  render () {
    const { object } = this.props
    const { formClassNames } = this.state
    let objectRcs = []
    let taxRcs = []
    let rcNames = []
    let guidsOfSynonyms = []

    if (!object || _.keys(object).length === 0) {
      return (
        <fieldset id='main'>
        </fieldset>
      )
    }

    if (object.Beziehungssammlungen && object.Beziehungssammlungen.length > 0) {
      // regular property collections
      objectRcs = _.filter(object.Beziehungssammlungen, function (rc) {
        return rc.Typ && rc.Typ !== 'taxonomisch'
      })
      // taxonomic property collections
      taxRcs = _.filter(object.Beziehungssammlungen, function (rc) {
        return rc.Typ && rc.Typ === 'taxonomisch'
      })
      // list of names of property collections
      // later it will be necessary to check if a property collection is already shown
      rcNames = _.pluck(object.Beziehungssammlungen, function (rc) {
        if (rc.Name) return rc.Name
      })
      guidsOfSynonyms = getGuidsOfSynonymsFromTaxonomicRcs(taxRcs)
    }

    // add taxonomic property collections
    // want defined order
    let taxRcComponent = null
    if (taxRcs.length > 0) {
      const rcs = _.map(taxRcs, function (rc) {
        return <RelationCollection key={rc.Name} object={object} relationCollection={rc} />
      })
      taxRcComponent = (
        <div>
          <h4>Taxonomische Beziehungen:</h4>
          {rcs}
        </div>
      )
    }

    // add property collections
    let pcComponent = null
    if (object.Eigenschaftensammlungen && object.Eigenschaftensammlungen.length > 0) {
      const pcs = _.map(object.Eigenschaftensammlungen, function (pc) {
        return <PropertyCollection key={pc.Name} pcType='Datensammlung' object={object} propertyCollection={pc}/>
      })
      pcComponent = (
        <div>
          <h4>Eigenschaften:</h4>
          {pcs}
        </div>
      )
    }

    // add relation collections
    let rcComponent = null
    if (objectRcs.length > 0) {
      const rcs = _.map(objectRcs, function (rc) {
        return <RelationCollection key={rc.Name} object={object} relationCollection={rc} />
      })
      rcComponent = (
        <div>
          <h4>Beziehungen:</h4>
          {rcs}
        </div>
      )
    }

    return (
      <fieldset id='main'>
        <form className={formClassNames} autoComplete='off'>
          <div id='formContent'>
            <h4>Taxonomie:</h4>
            {object.Taxonomie ? <PropertyCollection pcType='Taxonomie' object={object} propertyCollection={object.Taxonomie} /> : ''}
            {taxRcComponent ? taxRcComponent : ''}
            {pcComponent ? pcComponent : ''}
            {rcComponent ? rcComponent : ''}
            {/*<Inspector data={object}/>*/}
          </div>
        </form>
      </fieldset>
    )
  }
})
