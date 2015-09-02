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
import { Overlay, Glyphicon } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Errors',

  propTypes: {
    errors: React.PropTypes.array
  },

  onClickRemove () {
    app.Actions.showError()
  },

  render () {
    const { errors } = this.props
    const show = errors.length > 0
    const errorMessages = errors.map((error, index) => (
      <div className='errorContainer' key={index}>
        <div className='error'>
          {error.title ? <p>{error.title}</p> : null}
          <p><em>{error.msg}</em></p>
        </div>
        {index + 1 < errors.length ? <hr/> : null}
      </div>
    ))
    const glyphStyle = {
      position: 'absolute',
      top: 3 + 'px',
      right: 3 + 'px',
      fontSize: 18 + 'px',
      cursor: 'pointer'
    }

    return (
      <Overlay
        show={show}
        container={this}
        placement='top'
      >
        <div id='errors'>
          <Glyphicon glyph='remove-circle' style={glyphStyle} onClick={this.onClickRemove} />
          {errorMessages}
        </div>
      </Overlay>
    )
  }
})
