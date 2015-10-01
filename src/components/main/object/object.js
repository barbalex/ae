/*
 * Synonym Objects
 * in order not to have to constantly have all items loaded in memory
 * synonym objects are fetched from localDb
 * and then passed in as props
 */

'use strict'

import React from 'react'
// import Inspector from 'react-json-inspector'
import _ from 'lodash'
import Taxonomy from './taxonomy.js'
import PropertyCollection from './propertyCollection.js'
import RelationCollection from './relationCollection.js'

export default React.createClass({
  displayName: 'Object',

  propTypes: {
    object: React.PropTypes.object,
    synonymObjects: React.PropTypes.array
  },

  render () {
    const { object, synonymObjects } = this.props
    let pcsComponent = null
    let pcsOfSynonymsComponent = null
    let rcsComponent = null
    let rcsOfSynonymsComponent = null
    let taxRcsComponent = null
    let objectRcs = []
    let taxRcs = []
    let pcsOfSynonyms = []
    let rcsOfSynonyms = []
    let namesOfPcsBuilt = []
    let namesOfRcsBuilt = []

    // no object? > return empty component
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
      objectRcs = _.filter(rcs, (rc) => !rc.Typ)

      if (objectRcs.length > 0) {
        const rcComponent = objectRcs.map((rc, index) => <RelationCollection key={index} object={object} relationCollection={rc} />)
        rcsComponent = (
          <div>
            <h4>Beziehungen:</h4>
            {rcComponent}
          </div>
        )
      }

      // taxonomic relation collections
      taxRcs = _.filter(rcs, (rc) => rc.Typ && rc.Typ === 'taxonomisch')
      if (taxRcs.length > 0) {
        const taxRcComponent = taxRcs.map((rc, index) => <RelationCollection key={index} object={object} relationCollection={rc} />)
        taxRcsComponent = (
          <div>
            <h4>Taxonomische Beziehungen:</h4>
            {taxRcComponent}
          </div>
        )
      }

      // list of names of relation collections
      // needed to choose which relation collections of synonym objects need to be built
      namesOfRcsBuilt = _.pluck(rcs, 'Name')
    }

    // property collections
    if (object.Eigenschaftensammlungen && object.Eigenschaftensammlungen.length > 0) {
      const pcs = object.Eigenschaftensammlungen
      const pcComponent = pcs.map((pc, index) => <PropertyCollection key={index} pcType='Datensammlung' object={object} propertyCollection={pc}/>)
      pcsComponent = (
        <div>
          <h4>Eigenschaften:</h4>
          {pcComponent}
        </div>
      )

      // list names of property collections
      // needed to choose which property collections of synonym objects need to be built
      namesOfPcsBuilt = _.pluck(pcs, 'Name')
    }

    if (synonymObjects.length > 0) {
      synonymObjects.forEach((synonymObject) => {
        // property collections
        if (synonymObject.Eigenschaftensammlungen && synonymObject.Eigenschaftensammlungen.length > 0) {
          synonymObject.Eigenschaftensammlungen.forEach((pc) => {
            if (!_.includes(namesOfPcsBuilt, pc.Name)) {
              // this pc is not yet shown
              pcsOfSynonyms.push(pc)
              // update namesOfPcsBuilt
              namesOfPcsBuilt.push(pc.Name)
            }
          })
        }

        // relation collections
        if (synonymObject.Beziehungssammlungen && synonymObject.Beziehungssammlungen.length > 0) {
          synonymObject.Beziehungssammlungen.forEach((rcOfSynonym) => {
            if (!_.includes(namesOfRcsBuilt, rcOfSynonym.Name) && rcOfSynonym['Art der Beziehungen'] !== 'synonym' && rcOfSynonym.Typ !== 'taxonomisch') {
              // this rc is not yet shown and is not taxonomic
              rcsOfSynonyms.push(rcOfSynonym)
              // update namesOfRcsBuilt
              namesOfRcsBuilt.push(rcOfSynonym.Name)
            } else if (rcOfSynonym['Art der Beziehungen'] !== 'synonym' && rcOfSynonym.Typ !== 'taxonomisch') {
              // this rc is already shown
              // but there could be relations that are not shown yet
              const rcOfOriginal = _.find(object.Beziehungssammlungen, (rc) => rc.Name === rcOfSynonym.Name)

              if (rcOfSynonym.Beziehungen && rcOfSynonym.Beziehungen.length > 0 && rcOfOriginal && rcOfOriginal.Beziehungen && rcOfOriginal.Beziehungen.length > 0) {
                // Both objects have relations in the same relation collection
                // remove relations existing in original object from synonym
                rcOfSynonym.Beziehungen = _.reject(rcOfSynonym.Beziehungen, (relationOfSynonym) => {
                  // search in relations of original object for a relation with the same relation partners
                  const relationOfOriginalWithSamePartners = _.find(rcOfOriginal.Beziehungen, (relationOfOriginal) => {
                    if (relationOfSynonym.Beziehungspartner.length > 0 && relationOfOriginal.Beziehungspartner.length > 0) {
                      return relationOfSynonym.Beziehungspartner[0].GUID === relationOfOriginal.Beziehungspartner[0].GUID
                    }
                    return false
                  })
                  return !!relationOfOriginalWithSamePartners
                })
              }
              if (rcOfSynonym.Beziehungen.length > 0) {
                // if Synonym has relations that weren't yet shown, push them
                rcsOfSynonyms.push(rcOfSynonym)
              }
            }
          })
        }
      })

      if (pcsOfSynonyms.length > 0) {
        const pcComponent = pcsOfSynonyms.map((pc, index) => <PropertyCollection key={index} pcType='Datensammlung' object={object} propertyCollection={pc}/>)
        pcsOfSynonymsComponent = (
          <div>
            <h4>Eigenschaften von Synonymen:</h4>
            {pcComponent}
          </div>
        )
      }

      if (rcsOfSynonyms.length > 0) {
        const rcComponent = rcsOfSynonyms.map((rc, index) => <RelationCollection key={index} object={object} relationCollection={rc} />)
        rcsOfSynonymsComponent = (
          <div>
            <h4>Beziehungen von Synonymen:</h4>
            {rcComponent}
          </div>
        )
      }
    }

    return (
      <div id='object' className='formContent'>
        <Taxonomy
          object={object} />
        {taxRcsComponent ? taxRcsComponent : null}
        {pcsComponent ? pcsComponent : null}
        {rcsComponent ? rcsComponent : null}
        {pcsOfSynonymsComponent ? pcsOfSynonymsComponent : null}
        {rcsOfSynonymsComponent ? rcsOfSynonymsComponent : null}
        {/*<Inspector data={object}/>*/}
      </div>
    )
  }
})
