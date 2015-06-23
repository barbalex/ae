/*
 * this component presents a single property collection
 */

'use strict'

import React from 'react'
import { State } from 'react-router'
import replaceInvalidCharactersInIdNames from '../../../modules/replaceInvalidCharactersInIdNames.js'
import PropertyCollectionDescription from './propertyCollectionDescription.js'

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
        pcType: pcType,
        object: object,
        propertyCollection: propertyCollection
      }
    },

    render () {
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

      return (
        <div className='panel panel-default'>
          <div className='panel-heading panel-heading-gradient'>
            {object.Gruppe === 'Lebensräume' && pcType === 'Taxonomie' ? editToolbar : ''}
            <h4 className="panel-title">
              <a className="Datensammlung accordion-toggle" data-toggle="collapse" data-parent="#panelArt" href={'#collapse' + pcName}>
                {propertyCollection.Name}
              </a>
            </h4>
          </div>
          <div
            id={'collapse' + dsName}
            className={'panel-collapse collapse ' + object.Gruppe + ' ' + pcType}
          >
            <div className="panel-body">
              <PropertyCollectionDescription pc={propertyCollection} />

        </div>
      )
    }
  })
}
