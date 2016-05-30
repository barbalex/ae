/*
 * in order not to constantly have all items loaded in memory
 * synonym objects are fetched from localDb
 * and then passed in as props
 */

'use strict'

import React from 'react'
import { map as _map, reject } from 'lodash'
import Taxonomy from './Taxonomy.js'
import PropertyCollections from './Pcs.js'
import RelationCollections from './Rcs.js'
import TaxonomicRelationCollections from './TaxRcs.js'
import PcsOfSynonyms from './PcsOfSynonyms.js'
import RcsOfSynonyms from './RcsOfSynonyms.js'

// don't name it "Object" - that is a reserved word
const MyObject = ({
  object,
  onSaveObjectField,
  synonymObjects,
  userRoles,
  editObjects,
  toggleEditObjects,
  addNewObject,
  removeObject
}) => {
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
    taxRcs = rcs.filter((rc) =>
      rc.Typ && rc.Typ === 'taxonomisch'
    )
    // list of names of relation collections
    // needed to choose which relation collections of synonym objects need to be built
    namesOfRcsBuilt = _map(rcs, 'Name')
  }

  // list names of property collections
  // needed to choose which property collections of synonym objects need to be built
  if (pcs && pcs.length > 0) {
    namesOfPcsBuilt = _map(pcs, 'Name')
  }

  /**
   * build pcsOfSynonyms
   */
  if (synonymObjects && synonymObjects.length) {
    synonymObjects.forEach((synonymObject) => {
      // property collections
      if (
        synonymObject &&
        synonymObject.Eigenschaftensammlungen &&
        synonymObject.Eigenschaftensammlungen.length
      ) {
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
      const synonymObjectHasRelationCollections = (
        synonymObject &&
        synonymObject.Beziehungssammlungen &&
        synonymObject.Beziehungssammlungen.length
      )
      if (synonymObjectHasRelationCollections) {
        synonymObject.Beziehungssammlungen.forEach((rcOfSynonym) => {
          const rcIsTaxonomicAndNotYetIncluded = (
            !namesOfRcsBuilt.includes(rcOfSynonym.Name) &&
            rcOfSynonym['Art der Beziehungen'] !== 'synonym' &&
            rcOfSynonym.Typ !== 'taxonomisch'
          )
          if (rcIsTaxonomicAndNotYetIncluded) {
            // this rc is not yet shown and is not taxonomic
            rcsOfSynonyms.push(rcOfSynonym)
            // update namesOfRcsBuilt
            namesOfRcsBuilt.push(rcOfSynonym.Name)
          } else if (
            rcOfSynonym['Art der Beziehungen'] !== 'synonym' &&
            rcOfSynonym.Typ !== 'taxonomisch'
          ) {
            // this rc is already shown
            // but there could be relations that are not shown yet
            const rcOfOriginal = object.Beziehungssammlungen.find((rc) =>
              rc.Name === rcOfSynonym.Name
            )

            if (
              rcOfSynonym.Beziehungen &&
              rcOfSynonym.Beziehungen.length &&
              rcOfOriginal &&
              rcOfOriginal.Beziehungen &&
              rcOfOriginal.Beziehungen.length
            ) {
              // Both objects have relations in the same relation collection
              // remove relations existing in original object from synonym
              rcOfSynonym.Beziehungen = reject(rcOfSynonym.Beziehungen, (relationOfSynonym) => {
                // search in relations of original object for a relation with the same relation partners
                const relationOfOriginalWithSamePartners = rcOfOriginal.Beziehungen.find((relationOfOriginal) => {
                  if (
                    relationOfSynonym.Beziehungspartner.length > 0 &&
                    relationOfOriginal.Beziehungspartner.length > 0
                  ) {
                    return (
                      relationOfSynonym.Beziehungspartner[0].GUID ===
                      relationOfOriginal.Beziehungspartner[0].GUID
                    )
                  }
                  return false
                })
                return !!relationOfOriginalWithSamePartners
              })
            }
            // if Synonym has relations that weren't yet shown, push them
            if (rcOfSynonym.Beziehungen.length > 0) {
              rcsOfSynonyms.push(rcOfSynonym)
            }
          }
        })
      }
    })
  }

  return (
    <div
      id="object"
      className="formContent"
    >
      <Taxonomy
        object={object}
        onSaveObjectField={onSaveObjectField}
        userRoles={userRoles}
        editObjects={editObjects}
        toggleEditObjects={toggleEditObjects}
        addNewObject={addNewObject}
        removeObject={removeObject}
      />
      {
        taxRcs.length > 0 &&
        <TaxonomicRelationCollections
          taxRcs={taxRcs}
        />
      }
      {
        pcs.length > 0 &&
        <PropertyCollections
          object={object}
        />
      }
      {
        objectRcs.length > 0 &&
        <RelationCollections
          objectRcs={objectRcs}
        />
      }
      {
        pcsOfSynonyms.length > 0 &&
        <PcsOfSynonyms
          pcsOfSynonyms={pcsOfSynonyms}
          object={object}
        />
      }
      {
        rcsOfSynonyms.length > 0 &&
        <RcsOfSynonyms
          rcsOfSynonyms={rcsOfSynonyms}
        />
      }
    </div>
  )
}

MyObject.displayName = 'Object'

MyObject.propTypes = {
  object: React.PropTypes.object,
  onSaveObjectField: React.PropTypes.func,
  synonymObjects: React.PropTypes.array,
  userRoles: React.PropTypes.array,
  editObjects: React.PropTypes.bool,
  toggleEditObjects: React.PropTypes.func,
  addNewObject: React.PropTypes.func,
  removeObject: React.PropTypes.func
}

export default MyObject
