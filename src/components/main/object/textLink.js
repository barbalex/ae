/*
 * gets label, value, and url
 * returns a component with label and link
 * where the link is in a p element
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'

/**
 * can't use getPathFromGuid because it is possible that
 * the relation partner's group was not loaded yet
 * and using it starts an infinite loop
 */
const TextLink = ({ label, value, guid }) =>
  <div className="form-group">
    <label className="control-label">
      {
        label
        ? `${label}:`
        : null
      }
    </label>
    <p className="form-control-static feldtext controls">
      <a
        href={`/${guid}`}
        onClick={(event) => {
          event.preventDefault()
          if (guid) app.Actions.loadActiveObject(guid)
        }}
      >
        {value}
      </a>
    </p>
  </div>

TextLink.displayName = 'TextLink'

TextLink.propTypes = {
  label: React.PropTypes.string,
  value: React.PropTypes.string,
  gruppe: React.PropTypes.string,
  guid: React.PropTypes.string
}

export default TextLink
