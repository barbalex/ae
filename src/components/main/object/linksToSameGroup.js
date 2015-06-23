/*
 * gets fieldName and an array of objects
 * returns a component with label and a number of links to the same group
 */

'use strict'

import React from 'react'
import { State } from 'react-router'
import _ from 'lodash'

export default function (fieldName, objects) {
  return React.createClass({
    displayName: 'FieldLinkToSameGroup',

    mixins: [State],

    propTypes: {
      fieldName: React.PropTypes.string,
      objects: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    getInitialState () {
      return {
        fieldName: fieldName,
        objects: objects
      }
    },

    render () {
      const linkArray = _.map(objects, function (object) {
        return (
          <p className='form-control-static controls feldtext'>
            <a href='#' className='linkZuArtGleicherGruppe' ArtId={object.guid}>
              {object.Name}
            </a>
          </p>
        )
      })

      return (
        <div className='form-group'>
          <label className='control-label'>
            {fieldName + ':'}
          </label>
          <span className='feldtext controls'>
            {linkArray}
          </span>
        </div>
      )
    }
  })
}
