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
    let taxComponent = null
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

    // taxonomy collection
    if (object.Taxonomie) {
      taxComponent = <PropertyCollection pcType='Taxonomie' object={object} propertyCollection={object.Taxonomie} />
    }

    // relation collections
    if (object.Beziehungssammlungen && object.Beziehungssammlungen.length > 0) {
      const rcs = object.Beziehungssammlungen

      // regular relation collections
      objectRcs = _.filter(rcs, function (rc) {
        return !rc.Typ
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
      // needed to choose which relation collections of synonym objects need to be built
      namesOfRcsBuilt = _.pluck(rcs, 'Name')
    }

    // property collections
    if (object.Eigenschaftensammlungen && object.Eigenschaftensammlungen.length > 0) {
      const pcs = object.Eigenschaftensammlungen
      const pcComponent = _.map(pcs, function (pc) {
        return <PropertyCollection key={pc.Name} pcType='Datensammlung' object={object} propertyCollection={pc}/>
      })
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
      synonymObjects.forEach(function (synonymObject) {

        // property collections
        if (synonymObject.Eigenschaftensammlungen && synonymObject.Eigenschaftensammlungen.length > 0) {
          _.each(synonymObject.Eigenschaftensammlungen, function (pc) {
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
          _.each(synonymObject.Beziehungssammlungen, function (rcOfSynonym) {
            if (!_.includes(namesOfRcsBuilt, rcOfSynonym.Name) && rcOfSynonym['Art der Beziehungen'] !== 'synonym' && rcOfSynonym.Typ !== 'taxonomisch') {
              // this rc is not yet shown and is not taxonomic
              rcsOfSynonyms.push(rcOfSynonym)
              // update namesOfRcsBuilt
              namesOfRcsBuilt.push(rcOfSynonym.Name)
            } else if (rcOfSynonym['Art der Beziehungen'] !== 'synonym' && rcOfSynonym.Typ !== 'taxonomisch') {
              // this rc is already shown
              // but there could be relations that are not shown yet
              const rcOfOriginal = _.find(object.Beziehungssammlungen, function (rc) {
                return rc.Name === rcOfSynonym.Name
              })

              if (rcOfSynonym.Beziehungen && rcOfSynonym.Beziehungen.length > 0 && rcOfOriginal && rcOfOriginal.Beziehungen && rcOfOriginal.Beziehungen.length > 0) {
                // Both objects have relations in the same relation collection
                // remove relations existing in original object from synonym
                rcOfSynonym.Beziehungen = _.reject(rcOfSynonym.Beziehungen, function (relationOfSynonym) {
                  // search in relations of original object for a relation with the same relation partners
                  const relationOfOriginalWithSamePartners = _.find(rcOfOriginal.Beziehungen, function (relationOfOriginal) {
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
        const pcComponent = _.map(pcsOfSynonyms, function (pc) {
          return <PropertyCollection key={pc.Name} pcType='Datensammlung' object={object} propertyCollection={pc}/>
        })
        pcsOfSynonymsComponent = (
          <div>
            <h4>Eigenschaften von Synonymen:</h4>
            {pcComponent}
          </div>
        )
      }

      if (rcsOfSynonyms.length > 0) {
        const rcComponent = _.map(rcsOfSynonyms, function (rc) {
          return <RelationCollection key={rc.Name} object={object} relationCollection={rc} />
        })
        rcsOfSynonymsComponent = (
          <div>
            <h4>Beziehungen von Synonymen:</h4>
            {rcComponent}
          </div>
        )
      }
    }

    return (
      <div id='formContent'>
        <h4>Taxonomie:</h4>
        {taxComponent ? taxComponent : ''}
        {taxRcsComponent ? taxRcsComponent : ''}
        {pcsComponent ? pcsComponent : ''}
        {rcsComponent ? rcsComponent : ''}
        {pcsOfSynonymsComponent ? pcsOfSynonymsComponent : ''}
        {rcsOfSynonymsComponent ? rcsOfSynonymsComponent : ''}
        {/*<Inspector data={object}/>*/}
      </div>
    )
  }
})
