/*
 * gets fieldName, guid and the object's name
 * returns a component with label and a linke to the same group
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'

const FieldLinkToSameGroup = ({ fieldName, guid, objectName }) =>
  <div className="form-group">
    <label className="control-label">
      {`${fieldName}:`}
    </label>
    <p
      className="form-control-static controls feldtext"
    >
      <a
        href={`/${guid}`}
        className="linkZuArtGleicherGruppe"
        onClick={(event) => {
          event.preventDefault()
          if (guid) app.Actions.loadActiveObject(guid)
        }}
      >
        {objectName}
      </a>
    </p>
  </div>

FieldLinkToSameGroup.displayName = 'FieldLinkToSameGroup'

FieldLinkToSameGroup.propTypes = {
  fieldName: React.PropTypes.string,
  guid: React.PropTypes.string,
  objectName: React.PropTypes.string
}

export default FieldLinkToSameGroup
