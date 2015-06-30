/*
 * this component presents a single property collection
 */

'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import { State } from 'react-router'
import _ from 'lodash'
import PropertyCollectionDescription from './propertyCollectionDescription.js'
import RelationPartners from './relationPartners.js'
import RelationFields from './relationFields.js'
import sortRelationsByName from '../../../modules/sortRelationsByName.js'

export default React.createClass({
  displayName: 'PropertyCollection',

  mixins: [State],

  propTypes: {
    relationCollection: React.PropTypes.object
  },

  getInitialState () {

    // console.log('relationCollection.js: this.props.relationCollection:', this.props.relationCollection)

    return {
      relationCollection: this.props.relationCollection
    }
  },

  render () {
    const rc = this.state.relationCollection

    rc.Beziehungen = sortRelationsByName(rc.Beziehungen)

    const relations = _.map(rc.Beziehungen, function (relation, index) {
      const line = index < rc.Beziehungen.length - 1 ? <hr/> : ''
      return (
        <div>
          <RelationPartners relation={relation} />
          <RelationFields relation={relation} relationCollection={rc} />
          {line}
        </div>
      )
    })

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
