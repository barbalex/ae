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

const buildFieldForProperty = function (propertyCollection, object, value, key, pcType) {
  const pcName = propertyCollection.Name.replace(/"/g, "'")

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
    return <FieldInput key={key} fieldName={key} fieldValue={hierarchieString} inputType={'textarea'} pcType={pcType} pcName={pcName} />
  }
  if (_.isArray(value)) {
    // dieses Feld enthält einen Array von Werten
    return <FieldInput key={key} fieldName={key} fieldValue={value.toString()} inputType={'textarea'} pcType={pcType} pcName={pcName} />
  }
  return <Field key={key} fieldName={key} fieldValue={value} pcType={pcType} pcName={pcName} />
}

export default React.createClass({
  displayName: 'PropertyCollection',

  mixins: [State],

  propTypes: {
    pcType: React.PropTypes.string,
    object: React.PropTypes.object,
    propertyCollection: React.PropTypes.object
  },

  getInitialState () {

    console.log('propertyCollection.js: this.props.pcType:', this.props.pcType)
    console.log('propertyCollection.js: this.props.object:', this.props.object)
    console.log('propertyCollection.js: this.props.propertyCollection:', this.props.propertyCollection)

    return {
      pcType: this.props.pcType,
      object: this.props.object,
      propertyCollection: this.props.propertyCollection
    }
  },

  render () {
    const propertyCollection = this.state.propertyCollection
    const pcName = replaceInvalidCharactersInIdNames(propertyCollection.Name)
    const pcType = this.state.pcType
    const object = this.state.object

    const editToolbar = (
      <div className='btn-toolbar bearbToolbar'>
        <div className='btn-group btn-group-sm'>
          <button type='button' className='btn btn-default lrBearb lrBearbBtn' data-toggle='tooltip' title='bearbeiten'>
            <i className='glyphicon glyphicon-pencil'/>
          </button>
          <button type='button' className='btn btn-default lrBearb lrBearbSchuetzen disabled' title='schützen'>
            <i className='glyphicon glyphicon-ban-circle'/>
          </button>
          <button type='button' className='btn btn-default lrBearb lrBearbNeu disabled' title='neuer Lebensraum'>
            <i className='glyphicon glyphicon-plus'/>
          </button>
          <button type='button' data-toggle='modal' data-target='#rueckfrage_lr_loeschen' className='btn btn-default lrBearb lr_bearb_loeschen disabled' title='Lebensraum löschen'>
            <i className='glyphicon glyphicon-trash'/>
          </button>
        </div>
      </div>
    )

    const properties = _.map(propertyCollection.Eigenschaften, function (value, key) {
      return buildFieldForProperty(propertyCollection, object, value, key, pcType)
    })

    return (
      <Accordion>
        <Panel header={propertyCollection.Name} eventKey='1'>
          {object.Gruppe === 'Lebensräume' && pcType === 'Taxonomie' ? editToolbar : ''}
          <PropertyCollectionDescription pc={propertyCollection} />
          {pcType === 'Taxonomie' ? <Field fieldName={'GUID'} fieldValue={object._id} pcType={pcType} pcName={'Taxonomie'} /> : ''}
          {properties}
        </Panel>
      </Accordion>
    )
  }
})
