/*
 * gets label, value, and url
 * returns a component with label and link
 * where the link is in a p element
 */

import app from 'ampersand-app'
import React from 'react'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

/**
 * can't use getPathFromGuid because it is possible that
 * the relation partner's group was not loaded yet
 * and using it starts an infinite loop
 */
const TextLink = ({ label, value, guid }) =>
  <FormGroup controlId={label}>
    <ControlLabel>
      {label}
    </ControlLabel>
    <FormControl.Static>
      <a
        href={`/${guid}`}
        onClick={(event) => {
          event.preventDefault()
          if (guid) {
            app.Actions.loadActiveObject(guid)
          }
        }}
      >
        {value}
      </a>
    </FormControl.Static>
  </FormGroup>

TextLink.displayName = 'TextLink'

TextLink.propTypes = {
  label: React.PropTypes.string,
  value: React.PropTypes.string,
  guid: React.PropTypes.string
}

export default TextLink
