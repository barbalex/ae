'use strict'

// import app from 'ampersand-app'
import React from 'react'
// import Inspector from 'react-json-inspector'
import _ from 'lodash'
import PropertyCollection from './propertyCollection.js'
import RelationCollection from './relationCollection.js'

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
    let taxRcComponent = null
    if (taxBs.length > 0) {
      const rcs = _.map(taxBs, function (rc) {
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
    if (objektBs.length > 0) {
      const rcs = _.map(objektBs, function (rc) {
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
