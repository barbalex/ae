/*
 * this component presents a single property collection
 */

import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import { isArray, map } from 'lodash'
import replaceInvalidCharactersInIdNames from '../../../modules/replaceInvalidCharactersInIdNames.js'
import PcDescription from './PcDescription.js'
import LinkToSameGroup from './LinkToSameGroup.js'
import LinksToSameGroup from './LinksToSameGroup.js'
import FieldInput from './FieldInput.js'
import Field from './Field.js'
import isUserServerAdmin from '../../../modules/isUserServerAdmin.js'
import isUserOrgAdmin from '../../../modules/isUserOrgAdmin.js'
import isUserLrWriter from '../../../modules/isUserLrWriter.js'
import EditButtonGroup from './EditButtonGroup.js'

function buildFieldForProperty(
  propertyCollection,
  object,
  onSaveObjectField,
  value,
  key,
  pcType,
  collectionIsEditing
) {
  const pcName = propertyCollection.Name.replace(/"/g, "'")
  // bad hack because jsx shows &#39; not as ' but as &#39;
  if (typeof value === 'string') {
    value = value.replace('&#39;', '\'')
  }
  // lr.Taxonomie is lr.Einheit of to level lr > never change lr.Taxonomie
  if (key === 'Taxonomie' && object.Gruppe === 'Lebensräume') {
    collectionIsEditing = false
  }
  // don't show 'GUID' - _id is used instead
  // this field was removed and should not exist any more
  if (key === 'GUID') {
    return null
  }
  const buildAsSingleLink = (
    (
      object.Gruppe === 'Flora' &&
      (key === 'Offizielle Art' || key === 'Eingeschlossen in' || key === 'Synonym von')
    ) ||
    (
      object.Gruppe === 'Moose' &&
      key === 'Akzeptierte Referenz'
    )
  )
  if (buildAsSingleLink) {
    // build as single link
    // console.log('value', value)
    // get name from guid
    app.objectStore.getObject(value)
      .then((linkedObject) => {
        if (linkedObject) {
          const linkedObjectId = linkedObject._id
          const standardtaxonomie = linkedObject.Taxonomien.find((taxonomy) =>
            taxonomy.Standardtaxonomie
          )
          const linkedObjectName = standardtaxonomie.Eigenschaften['Artname vollständig']
          return (
            <LinkToSameGroup
              key={key}
              fieldName={key}
              guid={linkedObjectId}
              objectName={linkedObjectName}
              collectionIsEditing={collectionIsEditing}
              onSaveObjectField={onSaveObjectField}
            />
          )
        }
      })
      .catch((error) =>
        addError({
          title: 'pc.js: error getting item from objectStore:',
          msg: error
        })
      )
  }
  if (
    (key === 'Gültige Namen' || key === 'Eingeschlossene Arten') &&
    object.Gruppe === 'Flora'
  ) {
    // build array of links
    return (
      <LinksToSameGroup
        key={key}
        fieldName={key}
        objects={value}
        collectionIsEditing={collectionIsEditing}
        onSaveObjectField={onSaveObjectField}
      />
    )
  }
  const dontShowThisField = (
    (object.Gruppe === 'Flora' && ['Artname', 'Synonyme'].includes(key)) ||
    (key === 'Parent' && object.Gruppe === 'Lebensräume') ||
    (key === 'Hierarchie' && isArray(value))
  )
  if (dontShowThisField) {
    return null
  }
  if (isArray(value)) {
    // this field contains an array of values
    return (
      <FieldInput
        key={key}
        fieldName={key}
        fieldValue={value.toString()}
        inputType="textarea"
        pcType={pcType}
        pcName={pcName}
        collectionIsEditing={collectionIsEditing}
        onSaveObjectField={onSaveObjectField}
      />
    )
  }
  return (
    <Field
      key={key}
      fieldName={key}
      fieldValue={value}
      pcType={pcType}
      pcName={pcName}
      collectionIsEditing={collectionIsEditing}
      onSaveObjectField={onSaveObjectField}
    />
  )
}

const PropertyCollection = ({
  propertyCollection,
  pcType,
  object,
  onSaveObjectField,
  userRoles,
  editObjects,
  toggleEditObjects,
  addNewObject,
  removeObject
}) => {
  const pcName = replaceInvalidCharactersInIdNames(propertyCollection.Name)
  const isLr = object.Gruppe === 'Lebensräume'
  const org = propertyCollection['Organisation mit Schreibrecht']
  const collectionIsEditable = (
    isLr &&
    (
      isUserLrWriter(userRoles, org) ||
      isUserOrgAdmin(userRoles, org) ||
      isUserServerAdmin(userRoles)
    )
  )
  const collectionIsEditing = collectionIsEditable && editObjects
  const properties = map(propertyCollection.Eigenschaften, (value, key) =>
    buildFieldForProperty(
      propertyCollection,
      object,
      onSaveObjectField,
      value,
      key,
      pcType,
      collectionIsEditing
    )
  )
  const showPcDescription = (
    object.Gruppe !== 'Lebensräume' ||
    pcType !== 'Taxonomie'
  )

  return (
    <Accordion>
      <Panel
        header={propertyCollection.Name}
        eventKey={1}
      >
        {
          collectionIsEditable &&
            <EditButtonGroup
              editObjects={editObjects}
              toggleEditObjects={toggleEditObjects}
              addNewObject={addNewObject}
              removeObject={removeObject}
            />
        }
        {
          showPcDescription &&
            <PcDescription pc={propertyCollection} />
        }
        <div>
          {
            pcType === 'Taxonomie' &&
              <Field
                fieldName="GUID"
                fieldValue={object._id}
                pcType={pcType}
                pcName={pcName}
                collectionIsEditing={false}
              />
          }
          {properties}
        </div>
      </Panel>
    </Accordion>
  )
}

PropertyCollection.displayName = 'PropertyCollection'

PropertyCollection.propTypes = {
  pcType: React.PropTypes.string,
  object: React.PropTypes.object,
  onSaveObjectField: React.PropTypes.func,
  editObjects: React.PropTypes.bool,
  toggleEditObjects: React.PropTypes.func,
  addNewObject: React.PropTypes.func,
  removeObject: React.PropTypes.func,
  propertyCollection: React.PropTypes.object,
  userRoles: React.PropTypes.array
}

export default PropertyCollection
