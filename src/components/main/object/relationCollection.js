/*
 * this component presents a single property collection
 */

'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import { State } from 'react-router'
import _ from 'lodash'
import replaceInvalidCharactersInIdNames from '../../../modules/replaceInvalidCharactersInIdNames.js'
import PropertyCollectionDescription from './propertyCollectionDescription.js'
import LinkToSameGroup from './linkToSameGroup.js'
import LinksToSameGroup from './linksToSameGroup.js'
import FieldInput from './fieldInput.js'
import hierarchyStringFromHierarchyArray from './hierarchyStringFromHierarchyArray.js'
import Field from './field.js'
import sortRelationsByName from '../../../modules/sortRelationsByName.js'

const buildFieldForProperty = function (relationCollection, object, value, key, rcType) {
  const rcName = replaceInvalidCharactersInIdNames(relationCollection.Name)

  if (key === 'GUID') {
    // don't show. _id is used instead
    // this field should not exist any more
    return ''
  }
  if (((key === 'Offizielle Art' || key === 'Eingeschlossen in' || key === 'Synonym von') && object.Gruppe === 'Flora') || (key === 'Akzeptierte Referenz' && object.Gruppe === 'Moose')) {
    // build as link
    return <LinkToSameGroup key={key} fieldName={key} guid ={object._id} objectName={value.Name} />
  }
  if ((key === 'Gültige Namen' || key === 'Eingeschlossene Arten' || key === 'Synonyme') && object.Gruppe === 'Flora') {
    // build array of links
    return <LinksToSameGroup key={key} fieldName={key} objects={value} />
  }
  if ((key === 'Artname' && object.Gruppe === 'Flora') || (key === 'Parent' && object.Gruppe === 'Lebensräume')) {
    // don't show this field
  }
  if (key === 'Hierarchie' && object.Gruppe === 'Lebensräume' && _.isArray(value)) {
    // Namen kommagetrennt anzeigen
    const hierarchieString = hierarchyStringFromHierarchyArray(value)
    return <FieldInput key={key} fieldName={key} fieldValue={hierarchieString} inputType={'textarea'} rcType={rcType} rcName={rcName} />
  }
  if (_.isArray(value)) {
    // dieses Feld enthält einen Array von Werten
    return <FieldInput key={key} fieldName={key} fieldValue={value.toString()} inputType={'textarea'} rcType={rcType} rcName={rcName} />
  }
  return <Field key={key} fieldName={key} fieldValue={value.toString()} rcType={rcType} rcName={rcName} />
}

export default React.createClass({
  displayName: 'PropertyCollection',

  mixins: [State],

  propTypes: {
    rcType: React.PropTypes.string,
    object: React.PropTypes.object,
    relationCollection: React.PropTypes.object
  },

  getInitialState () {

    console.log('relationCollection.js: this.props.rcType:', this.props.rcType)
    console.log('relationCollection.js: this.props.object:', this.props.object)
    console.log('relationCollection.js: this.props.relationCollection:', this.props.relationCollection)

    return {
      rcType: this.props.rcType,
      object: this.props.object,
      relationCollection: this.props.relationCollection
    }
  },

  render () {
    const relationCollection = this.state.relationCollection
    const rcName = replaceInvalidCharactersInIdNames(relationCollection.Name)
    const rcType = this.state.rcType
    const object = this.state.object

    relationCollection.Beziehungen = sortRelationsByName(relationCollection.Beziehungen)

    const properties = _.map(relationCollection.Beziehungen, function (value, key) {
      return buildFieldForProperty(relationCollection, object, value, key, rcType)
    })

    return (
      <Accordion>
        <Panel header={relationCollection.Name + ' (' + relationCollection.Beziehungen.length + ')'} eventKey='1'>
          <PropertyCollectionDescription pc={relationCollection} />
          <div>
            {rcType === 'Taxonomie' ? <Field fieldName={'GUID'} fieldValue={object._id} rcType={rcType} rcName={rcName} /> : ''}
            {properties}
          </div>
        </Panel>
      </Accordion>
    )
  }
})
