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
import PropertyCollections from './pcs.js'
import RelationCollections from './rcs.js'
import PropertyCollection from './pc.js'
import RelationCollection from './rc.js'
import TaxonomicRelationCollections from './taxRcs.js'

export default React.createClass({
  displayName: 'Object',

  propTypes: {
    object: React.PropTypes.object,
    synonymObjects: React.PropTypes.array
  },

  render () {
    const { object, synonymObjects } = this.props
    let pcsOfSynonymsComponent = null
    let rcsOfSynonymsComponent = null
    let objectRcs = []
    let taxRcs = []
    let pcsOfSynonyms = []
    let rcsOfSynonyms = []
    let namesOfPcsBuilt = []
    let namesOfRcsBuilt = []
    const pcs = object.Eigenschaftensammlungen
    const rcs = object.Beziehungssammlungen

    // no object? > return empty component
    if (!object || _.keys(object).length === 0) {
      return (
        <fieldset id='main'>
        </fieldset>
      )
    }

    // relation collections
    if (rcs && rcs.length > 0) {
      // regular relation collections
      objectRcs = _.filter(rcs, (rc) => !rc.Typ)
      // taxonomic relation collections
      taxRcs = _.filter(rcs, (rc) => rc.Typ && rc.Typ === 'taxonomisch')
      // list of names of relation collections
      // needed to choose which relation collections of synonym objects need to be built
      namesOfRcsBuilt = _.pluck(rcs, 'Name')
    }

    // list names of property collections
    // needed to choose which property collections of synonym objects need to be built
    if (pcs && pcs.length > 0) namesOfPcsBuilt = _.pluck(pcs, 'Name')

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
        <Taxonomy object={object} />
        {taxRcs.length > 0 ? <TaxonomicRelationCollections taxRcs={taxRcs} /> : null}
        {pcs.length > 0 ? <PropertyCollections object={object} /> : null}
        {objectRcs.length > 0 ? <RelationCollections objectRcs={objectRcs} /> : null}
        {pcsOfSynonymsComponent ? pcsOfSynonymsComponent : null}
        {rcsOfSynonymsComponent ? rcsOfSynonymsComponent : null}
        {/*<Inspector data={object}/>*/}
      </div>
    )
  }
})
