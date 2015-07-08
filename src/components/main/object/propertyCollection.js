/*
 * this component presents a single property collection
 */

'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
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
  if (typeof value === 'string') {
    // bad hack because jsx shows &#39; not as ' but as &#39;
    value = value.replace('&#39;', '\'')
  }

  if (key === 'GUID') {
    // don't show. _id is used instead
    // this field was removed and should not exist any more
    return null
  }
  if (((key === 'Offizielle Art' || key === 'Eingeschlossen in' || key === 'Synonym von') && object.Gruppe === 'Flora') || (key === 'Akzeptierte Referenz' && object.Gruppe === 'Moose')) {
    // build as single link
    console.log('value', value)
    // get name from guid
    const linkedObject = window.objectStore.getItem(value)
    if (linkedObject) {
      const linkedObjectId = linkedObject._id
      const linkedObjectName = linkedObject.Taxonomie.Eigenschaften['Artname vollständig']
      return <LinkToSameGroup key={key} fieldName={key} guid ={linkedObjectId} objectName={linkedObjectName} />
    }
  }
  if ((key === 'Gültige Namen' || key === 'Eingeschlossene Arten' || key === 'Synonyme') && object.Gruppe === 'Flora') {
    // build array of links
    return <LinksToSameGroup key={key} fieldName={key} objects={value} />
  }
  if ((key === 'Artname' && object.Gruppe === 'Flora') || (key === 'Parent' && object.Gruppe === 'Lebensräume')) {
    // don't show this field
    return null
  }
  if (key === 'Hierarchie' && object.Gruppe === 'Lebensräume' && _.isArray(value)) {
    // show names separated by new line
    const hierarchieString = hierarchyStringFromHierarchyArray(value)
    return <FieldInput key={key} fieldName={key} fieldValue={hierarchieString} inputType={'textarea'} pcType={pcType} pcName={pcName} />
  }
  if (_.isArray(value)) {
    // this field contains an array of values
    return <FieldInput key={key} fieldName={key} fieldValue={value.toString()} inputType={'textarea'} pcType={pcType} pcName={pcName} />
  }
  return <Field key={key} fieldName={key} fieldValue={value} pcType={pcType} pcName={pcName} />
}

export default React.createClass({
  displayName: 'PropertyCollection',

  propTypes: {
    pcType: React.PropTypes.string,
    object: React.PropTypes.object,
    propertyCollection: React.PropTypes.object
  },

  render () {
    const { propertyCollection, pcType, object } = this.props
    const pcName = replaceInvalidCharactersInIdNames(propertyCollection.Name)

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
          <div>
            {pcType === 'Taxonomie' ? <Field fieldName={'GUID'} fieldValue={object._id} pcType={pcType} pcName={pcName} /> : ''}
            {properties}
          </div>
        </Panel>
      </Accordion>
    )
  }
})
