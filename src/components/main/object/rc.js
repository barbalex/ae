/*
 * this component presents a single property collection
 */

'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import PcDescription from './pcDescription.js'
import RelationPartners from './relationPartners.js'
import RelationFields from './relationFields.js'
import sortRelationsByName from '../../../modules/sortRelationsByName.js'

const RelationCollection = ({ relationCollection }) => {
  const rc = relationCollection
  if (!rc.Beziehungen || rc.Beziehungen.length === 0) {
    return null
  }

  rc.Beziehungen = sortRelationsByName(rc.Beziehungen)

  const relations = rc.Beziehungen.map((relation, index) =>
    <div key={index}>
      <RelationPartners relation={relation} />
      <RelationFields
        relation={relation}
        relationCollection={rc}
      />
      {
        index < rc.Beziehungen.length - 1 &&
        <hr />
      }
    </div>
  )

  return (
    <Accordion>
      <Panel
        header={`${rc.Name} (${rc.Beziehungen.length})`}
        eventKey={1}
      >
        <PcDescription pc={rc} />
        {relations}
      </Panel>
    </Accordion>
  )
}

RelationCollection.displayName = 'RelationCollection'

RelationCollection.propTypes = {
  relationCollection: React.PropTypes.object
}

export default RelationCollection
