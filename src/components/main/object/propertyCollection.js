/*
 * this component presents a single property collection
 */

'use strict'

import React from 'react'
import { State } from 'react-router'
import _ from 'lodash'
import replaceInvalidCharactersInIdNames from '../../../modules/replaceInvalidCharactersInIdNames.js'
import PropertyCollectionDescription from './propertyCollectionDescription.js'
import field from './field.js'
import LinkToSameGroup from './linkToSameGroup.js'
import LinksToSameGroup from './linksToSameGroup.js'

const buildFieldForProperty = function (object, value, key, pcType) {
  if (key === 'GUID') {
    // don't show. _id is used instead
    // this field should not exist any more
    return ''
  }
  if (((key === 'Offizielle Art' || key === 'Eingeschlossen in' || key === 'Synonym von') && object.Gruppe === 'Flora') || (key === 'Akzeptierte Referenz' && object.Gruppe === 'Moose')) {
    // build as link
    return <LinkToSameGroup fieldName={key} guid ={object._id} objectName={value.Name} />
  }
  if ((key === 'Gültige Namen' || key === 'Eingeschlossene Arten' || key === 'Synonyme') && object.Gruppe === 'Flora') {
    // build array of links
    return <LinksToSameGroup fieldName={key} objects={value} />
  }
  if ((key === 'Artname' && object.Gruppe === 'Flora') || (key === 'Parent' && object.Gruppe === 'Lebensräume')) {
    // dieses Feld nicht anzeigen
  } else if (key === 'Hierarchie' && object.Gruppe === 'Lebensräume' && _.isArray(value)) {
    // Namen kommagetrennt anzeigen
    hierarchieString = erstelleHierarchieFuerFeldAusHierarchieobjekteArray(value)
    htmlDatensammlung += generiereHtmlFuerTextarea(key, hierarchieString, pcType, datensammlung.Name.replace(/"/g, "'"))
  } else if (_.isArray(value)) {
    // dieses Feld enthält einen Array von Werten
    arrayString = value.toString()
    htmlDatensammlung += generiereHtmlFuerTextarea(key, arrayString, pcType, datensammlung.Name.replace(/"/g, "'"))
  } else {
    htmlDatensammlung += erstelleHtmlFuerFeld(key, value, pcType, datensammlung.Name.replace(/"/g, "'"))
  }
}

export default function (pcType, object, propertyCollection) {
  return React.createClass({
    displayName: 'PropertyCollectionDescription',

    mixins: [State],

    propTypes: {
      pcType: React.PropTypes.string,
      object: React.PropTypes.object,
      propertyCollection: React.PropTypes.object
    },

    getInitialState () {
      return {
        pcType: this.props.pcType,
        object: this.props.object,
        propertyCollection: this.props.propertyCollection
      }
    },

    render () {
      const pcName = replaceInvalidCharactersInIdNames(propertyCollection.Name)
      const pcType = this.state.pcType
      const object = this.state.object
      const propertyCollection = this.state.propertyCollection

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
        return buildFieldForProperty(object, value, key, pcType)
      }).join('\n')

      return (
        <div className='panel panel-default'>
          <div className='panel-heading panel-heading-gradient'>
            {object.Gruppe === 'Lebensräume' && pcType === 'Taxonomie' ? editToolbar : ''}
            <h4 className='panel-title'>
              <a className='Datensammlung accordion-toggle' data-toggle='collapse' data-parent='#panelArt' href={'#collapse' + pcName}>
                {propertyCollection.Name}
              </a>
            </h4>
          </div>
          <div
            id={'collapse' + pcName}
            className={'panel-collapse collapse ' + object.Gruppe + ' ' + pcType}
          >
            <div className='panel-body'>
              <PropertyCollectionDescription pc={propertyCollection} />
              {pcType === 'Taxonomie' ? field('GUID', object._id, pcType, 'Taxonomie') : ''}
              {properties}
            </div>
          </div>
        </div>
      )
    }
  })
}
