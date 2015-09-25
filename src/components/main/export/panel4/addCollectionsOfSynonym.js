'use strict'

/**
 * gets objects, objectToAddTo and _id of synonym
 * finds synonym
 * adds missing pcs and missing rcs to objectToAddTo
 * returns objectToAddTo
 */

import _ from 'lodash'

export default (objects, objectToAddTo, _id) => {
  const synonym = _.find(objects, (object) => object._id === _id)
  if (synonym) {
    // add missing pcs
    const synPcs = _.get(synonym, 'Eigenschaftensammlungen')
    const pcs = _.get(objectToAddTo, 'Eigenschaftensammlungen')
    synPcs.forEach((synPc) => {
      const existing = _.find(pcs, (pc) => pc.Name === synPc.Name)
      if (!existing) objectToAddTo.Eigenschaftensammlungen.push(synPc)
    })
    // add missing rcs
    const synRcs = _.get(synonym, 'Beziehungssammlungen')
    const rcs = _.get(objectToAddTo, 'Beziehungssammlungen')
    synRcs.forEach((synRc) => {
      // we don't want taxonomic rc's
      if (!_.get(synRc, 'Typ')) {
        const existing = _.find(rcs, (rc) => rc.Name === synRc.Name)
        if (!existing) objectToAddTo.Beziehungssammlungen.push(synRc)
      }
    })
  }
  return objectToAddTo
}
