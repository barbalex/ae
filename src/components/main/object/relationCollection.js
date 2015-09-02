/*
 * this component presents a single property collection
 */

'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import PropertyCollectionDescription from './propertyCollectionDescription.js'
import RelationPartners from './relationPartners.js'
import RelationFields from './relationFields.js'
import sortRelationsByName from '../../../modules/sortRelationsByName.js'

export default React.createClass({
  displayName: 'RelationCollection',

  propTypes: {
    relationCollection: React.PropTypes.object
  },

  render () {
    const rc = this.props.relationCollection

    rc.Beziehungen = sortRelationsByName(rc.Beziehungen)

    const relations = _.map(rc.Beziehungen, (relation, index) =>
      (
        <div key={index}>
          <RelationPartners relation={relation} />
          <RelationFields relation={relation} relationCollection={rc} />
          {index < rc.Beziehungen.length - 1 ? <hr/> : ''}
        </div>
      )
    )

    return (
      <Accordion>
        <Panel header={rc.Name + ' (' + rc.Beziehungen.length + ')'} eventKey='1'>
          <PropertyCollectionDescription pc={rc} />
          <div>
            {relations}
          </div>
        </Panel>
      </Accordion>
    )
  }
})
