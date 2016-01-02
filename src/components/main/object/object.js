/*
 * in order not to constantly have all items loaded in memory
 * synonym objects are fetched from localDb
 * and then passed in as props
 */

'use strict'

import React from 'react'
import { pluck, reject } from 'lodash'
import Taxonomy from './taxonomy.js'
import PropertyCollections from './pcs.js'
import RelationCollections from './rcs.js'
import TaxonomicRelationCollections from './taxRcs.js'
import PcsOfSynonyms from './pcsOfSynonyms.js'
import RcsOfSynonyms from './rcsOfSynonyms.js'

export default React.createClass({
  displayName: 'Object',

  propTypes: {
    object: React.PropTypes.object,
    onChangeObjectField: React.PropTypes.func,
    synonymObjects: React.PropTypes.array,
    userRoles: React.PropTypes.array,
    editObjects: React.PropTypes.bool,
    toggleEditObjects: React.PropTypes.func,
    addNewObject: React.PropTypes.func,
    removeObject: React.PropTypes.func
  },

  render () {
    const { object, onChangeObjectField, synonymObjects, userRoles, editObjects, toggleEditObjects, addNewObject, removeObject } = this.props
    let objectRcs = []
    let taxRcs = []
    let pcsOfSynonyms = []
    let rcsOfSynonyms = []
    let namesOfPcsBuilt = []
    let namesOfRcsBuilt = []
    const pcs = object.Eigenschaftensammlungen
    const rcs = object.Beziehungssammlungen

    // relation collections
    if (rcs && rcs.length > 0) {
      // regular relation collections
      objectRcs = rcs.filter((rc) => !rc.Typ)
      // taxonomic relation collections
      taxRcs = rcs.filter((rc) => rc.Typ && rc.Typ === 'taxonomisch')
      // list of names of relation collections
      // needed to choose which relation collections of synonym objects need to be built
      namesOfRcsBuilt = pluck(rcs, 'Name')
    }

    // list names of property collections
    // needed to choose which property collections of synonym objects need to be built
    if (pcs && pcs.length > 0) namesOfPcsBuilt = pluck(pcs, 'Name')

    /**
     * build pcsOfSynonyms
     */
    if (synonymObjects.length > 0) {
      synonymObjects.forEach((synonymObject) => {
        // property collections
        if (synonymObject && synonymObject.Eigenschaftensammlungen && synonymObject.Eigenschaftensammlungen.length > 0) {
          synonymObject.Eigenschaftensammlungen.forEach((pc) => {
            if (!namesOfPcsBuilt.includes(pc.Name)) {
              // this pc is not yet shown
              pcsOfSynonyms.push(pc)
              // update namesOfPcsBuilt
              namesOfPcsBuilt.push(pc.Name)
            }
          })
        }

        /**
         * build rcsOfSynonyms
         */
        if (synonymObject && synonymObject.Beziehungssammlungen && synonymObject.Beziehungssammlungen.length > 0) {
          synonymObject.Beziehungssammlungen.forEach((rcOfSynonym) => {
            if (!namesOfRcsBuilt.includes(rcOfSynonym.Name) && rcOfSynonym['Art der Beziehungen'] !== 'synonym' && rcOfSynonym.Typ !== 'taxonomisch') {
              // this rc is not yet shown and is not taxonomic
              rcsOfSynonyms.push(rcOfSynonym)
              // update namesOfRcsBuilt
              namesOfRcsBuilt.push(rcOfSynonym.Name)
            } else if (rcOfSynonym['Art der Beziehungen'] !== 'synonym' && rcOfSynonym.Typ !== 'taxonomisch') {
              // this rc is already shown
              // but there could be relations that are not shown yet
              const rcOfOriginal = object.Beziehungssammlungen.find((rc) => rc.Name === rcOfSynonym.Name)

              if (rcOfSynonym.Beziehungen && rcOfSynonym.Beziehungen.length > 0 && rcOfOriginal && rcOfOriginal.Beziehungen && rcOfOriginal.Beziehungen.length > 0) {
                // Both objects have relations in the same relation collection
                // remove relations existing in original object from synonym
                rcOfSynonym.Beziehungen = reject(rcOfSynonym.Beziehungen, (relationOfSynonym) => {
                  // search in relations of original object for a relation with the same relation partners
                  const relationOfOriginalWithSamePartners = rcOfOriginal.Beziehungen.find((relationOfOriginal) => {
                    if (relationOfSynonym.Beziehungspartner.length > 0 && relationOfOriginal.Beziehungspartner.length > 0) {
                      return relationOfSynonym.Beziehungspartner[0].GUID === relationOfOriginal.Beziehungspartner[0].GUID
                    }
                    return false
                  })
                  return !!relationOfOriginalWithSamePartners
                })
              }
              // if Synonym has relations that weren't yet shown, push them
              if (rcOfSynonym.Beziehungen.length > 0) rcsOfSynonyms.push(rcOfSynonym)
            }
          })
        }
      })
    }

    return (
      <div
        id='object'
        className='formContent'>
        <Taxonomy
          object={object}
          onChangeObjectField={onChangeObjectField}
          userRoles={userRoles}
          editObjects={editObjects}
          toggleEditObjects={toggleEditObjects}
          addNewObject={addNewObject}
          removeObject={removeObject} />
        {
          taxRcs.length > 0
          ? <TaxonomicRelationCollections
              taxRcs={taxRcs} />
          : null
        }
        {
          pcs.length > 0
          ? <PropertyCollections
              object={object} />
          : null
        }
        {
          objectRcs.length > 0
          ? <RelationCollections
              objectRcs={objectRcs} />
          : null
        }
        {
          pcsOfSynonyms.length > 0
          ? <PcsOfSynonyms
              pcsOfSynonyms={pcsOfSynonyms}
              object={object} />
          : null
        }
        {
          rcsOfSynonyms.length > 0
          ? <RcsOfSynonyms
              rcsOfSynonyms={rcsOfSynonyms} />
          : null
        }
      </div>
    )
  }
})
