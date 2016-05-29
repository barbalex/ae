/*
 * gets fieldName and an array of objects
 * returns a component with label and a number of links to the same group
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import getPathFromGuid from '../../../modules/getPathFromGuid.js'

const FieldLinksToSameGroup = ({ objects, fieldName }) => {
  const linkArray = objects.map((object, index) =>
    getPathFromGuid(object.guid)
      .then((result) => {
        const url = result.url
        return (
          <p
            key={index}
            className="controls feldtext"
          >
            <a
              href={url}
              className="form-control-static linkZuArtGleicherGruppe"
              onClick={(event) => {
                event.preventDefault()
                if (object._id) app.Actions.loadActiveObject(object._id)
              }}
            >
              {object.Name}
            </a>
          </p>
        )
      })
      .catch((error) =>
        app.Actions.showError({
          title: `linksToSameGroup.js: error getting path for guid ${object.guid}:`,
          msg: error
        })
      )
  )

  return (
    <div className="form-group">
      <label className="control-label">
        {fieldName}
      </label>
      <span className="feldtext controls">
        {linkArray}
      </span>
    </div>
  )
}

FieldLinksToSameGroup.displayName = 'FieldLinksToSameGroup'

FieldLinksToSameGroup.propTypes = {
  fieldName: React.PropTypes.string,
  objects: React.PropTypes.arrayOf(React.PropTypes.object)
}

export default FieldLinksToSameGroup
