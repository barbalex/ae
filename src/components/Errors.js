/*
 * receives an object with two keys: title, msg
 * displays it while the object is present
 *
 * if a view wants to inform of an error it
 * calls action showError and passes the object
 * the errorStore triggers, passing the error
 * ...then triggers again some time later, passing an empty error object
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'
import ErrorComponent from './Error.js'

const styles = StyleSheet.create({
  rootDiv: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    marginLeft: 8,
    backgroundColor: 'orange',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
    border: '1px solid #CCC',
    borderRadius: 3,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 3
  },
  glyph: {
    position: 'absolute',
    top: 3,
    right: 3,
    fontSize: 18,
    cursor: 'pointer'
  }
})

const errorComponents = (errors) =>
  errors.map((error, index) =>
    <ErrorComponent
      key={index}
      errors={errors}
      error={error}
      index={index}
    />
  )

const Errors = ({ errors }) =>
  <div
    id="errors"
    className={css(styles.rootDiv)}
  >
    <Glyphicon
      glyph="remove-circle"
      className={css(styles.glyph)}
      onClick={() =>
        app.Actions.showError()
      }
    />
    {errorComponents(errors)}
  </div>

Errors.displays = 'Errors'

Errors.propTypes = {
  errors: React.PropTypes.array
}

export default Errors
