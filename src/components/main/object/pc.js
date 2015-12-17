/*
 * this component presents a single property collection
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import replaceInvalidCharactersInIdNames from '../../../modules/replaceInvalidCharactersInIdNames.js'
import PcDescription from './pcDescription.js'
import LinkToSameGroup from './linkToSameGroup.js'
import LinksToSameGroup from './linksToSameGroup.js'
import FieldInput from './fieldInput.js'
import Field from './field.js'
import isUserServerAdmin from '../../../modules/isUserServerAdmin.js'
import isUserOrgAdmin from '../../../modules/isUserOrgAdmin.js'
import isUserLrWriter from '../../../modules/isUserLrWriter.js'
import EditButtonGroup from './editButtonGroup.js'

function buildFieldForProperty (propertyCollection, object, value, key, pcType) {
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
    // console.log('value', value)
    // get name from guid
    app.objectStore.getItem(value)
      .then((linkedObject) => {
        if (linkedObject) {
          const linkedObjectId = linkedObject._id
          const standardtaxonomie = linkedObject.Taxonomien.find((taxonomy) => taxonomy.Standardtaxonomie)
          const linkedObjectName = standardtaxonomie.Eigenschaften['Artname vollständig']
          return <LinkToSameGroup key={key} fieldName={key} guid ={linkedObjectId} objectName={linkedObjectName} />
        }
      })
      .catch((error) => app.Actions.showError({title: 'pc.js: error getting item from objectStore:', msg: error}))
  }
  if ((key === 'Gültige Namen' || key === 'Eingeschlossene Arten') && object.Gruppe === 'Flora') {
    // build array of links
    return <LinksToSameGroup key={key} fieldName={key} objects={value} />
  }
  if (((key === 'Artname' || key === 'Synonyme') && object.Gruppe === 'Flora') || (key === 'Parent' && object.Gruppe === 'Lebensräume') || (key === 'Hierarchie' && _.isArray(value))) {
    // don't show this field
    return null
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
    propertyCollection: React.PropTypes.object,
    userRoles: React.PropTypes.array,
    editing: React.PropTypes.bool
  },

  getInitialState () {
    return {
      editing: false
    }
  },

  toggleEditing () {
    const { editing } = this.state
    this.setState({ editing: !editing })
  },

  render () {
    const { propertyCollection, pcType, object, userRoles } = this.props
    const { editing } = this.state
    const pcName = replaceInvalidCharactersInIdNames(propertyCollection.Name)
    const isLr = object.Gruppe === 'Lebensräume'
    const org = propertyCollection['Organisation mit Schreibrecht']
    const collectionIsEditable = isLr && (isUserLrWriter(userRoles, org) || isUserOrgAdmin(userRoles, org) || isUserServerAdmin(userRoles))

    console.log('pc.js, render, isLr', isLr)
    console.log('pc.js, render, userRoles', userRoles)
    console.log('pc.js, render, org', org)
    console.log('pc.js, render, collectionIsEditable', collectionIsEditable)

    const properties = _.map(propertyCollection.Eigenschaften, (value, key) => buildFieldForProperty(propertyCollection, object, value, key, pcType))

    const showPcDescription = object.Gruppe !== 'Lebensräume' || pcType !== 'Taxonomie'

    return (
      <Accordion>
        <Panel
          header={propertyCollection.Name}
          eventKey='1'>
          {
            collectionIsEditable
            ? <EditButtonGroup
              editing={editing}
              toggleEditing={this.toggleEditing} />
            : null
          }
          {
            showPcDescription
            ? <PcDescription pc={propertyCollection} />
            : null
          }
          <div>
            {
              pcType === 'Taxonomie'
              ? <Field
                  fieldName={'GUID'}
                  fieldValue={object._id}
                  pcType={pcType}
                  pcName={pcName} />
              : null
            }
            {properties}
          </div>
        </Panel>
      </Accordion>
    )
  }
})
