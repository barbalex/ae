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
    object: React.PropTypes.object,
    items: React.PropTypes.object
  },

  getInitialState () {
    const formClassNames = window.innerWidth > 700 ? 'form form-horizontal' : 'form'
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
    const { object, items } = this.props
    const { formClassNames } = this.state
    let pcsComponent = null
    let rcsComponent = null
    let taxRcsComponent = null
    let objectRcs = []
    let taxRcs = []
    let guidsOfSynonyms = []
    let synonymObjects = {}
    let pcsOfSynonyms = []
    let rcsOfSynonyms = []
    let namesOfPcsBuilt = []
    let namesOfRcsBuilt = []

    // no object?
    if (!object || _.keys(object).length === 0) {
      return (
        <fieldset id='main'>
        </fieldset>
      )
    }

    // relation collections
    if (object.Beziehungssammlungen && object.Beziehungssammlungen.length > 0) {
      const rcs = object.Beziehungssammlungen
      // regular relation collections
      objectRcs = _.filter(rcs, function (rc) {
        return rc.Typ && rc.Typ !== 'taxonomisch'
      })
      if (objectRcs.length > 0) {
        const rcComponent = _.map(objectRcs, function (rc) {
          return <RelationCollection key={rc.Name} object={object} relationCollection={rc} />
        })
        rcsComponent = (
          <div>
            <h4>Beziehungen:</h4>
            {rcComponent}
          </div>
        )
      }

      // taxonomic relation collections
      taxRcs = _.filter(rcs, function (rc) {
        return rc.Typ && rc.Typ === 'taxonomisch'
      })
      if (taxRcs.length > 0) {
        const taxRcComponent = _.map(taxRcs, function (rc) {
          return <RelationCollection key={rc.Name} object={object} relationCollection={rc} />
        })
        taxRcsComponent = (
          <div>
            <h4>Taxonomische Beziehungen:</h4>
            {taxRcComponent}
          </div>
        )
      }

      // list of names of relation collections
      // later it will be necessary to check if a property collection is already shown
      namesOfRcsBuilt = _.pluck(object.Beziehungssammlungen, function (rc) {
        if (rc.Name) return rc.Name
      })

      // synonym objects
      guidsOfSynonyms = getGuidsOfSynonymsFromTaxonomicRcs(taxRcs)
      synonymObjects = _.filter(items, function (object, guid) {
        return _.includes(guidsOfSynonyms, guid)
      })
    }

    // add property collections
    if (object.Eigenschaftensammlungen && object.Eigenschaftensammlungen.length > 0) {
      const pcComponent = _.map(object.Eigenschaftensammlungen, function (pc) {
        return <PropertyCollection key={pc.Name} pcType='Datensammlung' object={object} propertyCollection={pc}/>
      })
      pcsComponent = (
        <div>
          <h4>Eigenschaften:</h4>
          {pcComponent}
        </div>
      )
    }

    return (
      <fieldset id='main'>
        <form className={formClassNames} autoComplete='off'>
          <div id='formContent'>
            <h4>Taxonomie:</h4>
            {object.Taxonomie ? <PropertyCollection pcType='Taxonomie' object={object} propertyCollection={object.Taxonomie} /> : ''}
            {taxRcsComponent ? taxRcsComponent : ''}
            {pcsComponent ? pcsComponent : ''}
            {rcsComponent ? rcsComponent : ''}
            {/*<Inspector data={object}/>*/}
          </div>
        </form>
      </fieldset>
    )
  }
})
