'use strict'

/**
 * creates user lists for esWriters, lrWriters and orgAdmins
 * manages adding and removing
 */

import app from 'ampersand-app'
import React from 'react'
import { Input, Glyphicon, ListGroup, ListGroupItem, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap'
import isValidEmail from '../../../modules/isValidEmail.js'

export default React.createClass({
  displayName: 'UsersList',

  propTypes: {
    activeOrganization: React.PropTypes.object,
    newUser: React.PropTypes.string,
    newUserAlert: React.PropTypes.string,
    // this is: esWriter, lrWriter or orgAdmin
    userFieldName: React.PropTypes.string
  },

  getInitialState () {
    return {
      newUser: null,
      newUserAlert: null
    }
  },

  removeUser (user) {
    const { userFieldName } = this.props
    app.Actions.removeUserFromActiveOrganization(user, userFieldName)
  },

  removeUserTooltip () {
    return <Tooltip id='removeThisUser'>entfernen</Tooltip>
  },

  removeUserGlyph (user) {
    const glyphStyle = {
      position: 'absolute',
      right: 10,
      top: 8,
      fontSize: 1.5 + 'em',
      color: 'red',
      cursor: 'pointer'
    }
    return (
      <OverlayTrigger
        placement='top'
        overlay={this.removeUserTooltip()}>
        <Glyphicon
          glyph='remove-circle'
          style={glyphStyle}
          onClick={this.removeUser.bind(this, user)} />
      </OverlayTrigger>
    )
  },

  users () {
    const { activeOrganization, userFieldName } = this.props

    if (activeOrganization && activeOrganization[userFieldName] && activeOrganization[userFieldName].length > 0) {
      return activeOrganization[userFieldName].map((user, index) => (
        <ListGroupItem key={index}>
          {user}
          {this.removeUserGlyph(user)}
        </ListGroupItem>
      ))
    }
    return <p>(Noch) keine</p>
  },

  onChangeNewEsWriter (event) {
    const newUser = event.target.value
    this.setState({ newUser })
  },

  onBlurNewEsWriter () {
    let { newUser, newUserAlert } = this.state
    const { activeOrganization, userFieldName } = this.props

    // set alert back if exists
    if (newUserAlert) newUserAlert = null

    if (newUser) {
      // is this valid email?
      if (!isValidEmail(newUser)) {
        newUserAlert = 'Bitte erfassen Sie eine email-Adresse'
        return this.setState({ newUserAlert })
      }

      // is this a registered user? Sorry, no way to test this without password
      // save change
      if (activeOrganization[userFieldName]) {
        activeOrganization[userFieldName].push(newUser)
        app.Actions.updateActiveOrganization(activeOrganization.Name, activeOrganization)
      }
    }

    // manage state and set back newUser
    newUser = null
    this.setState({ newUserAlert, newUser })
  },

  newUserAlert () {
    const { newUserAlert } = this.state
    return (
      <Alert bsStyle='danger'>
        <strong>{newUserAlert}</strong>
      </Alert>
    )
  },

  render () {
    const { userFieldName } = this.props
    const { newUser, newUserAlert } = this.state
    const newEsWriterBsStyle = newUserAlert ? 'error' : null
    const titleObject = {
      esWriters: 'Benutzer mit Schreibrecht für Eigenschaften- und Beziehungssammlungen',
      lrWriters: 'Benutzer mit Schreibrecht für Lebensräume',
      orgAdmins: 'Organisations-Administrator'
    }
    const title = titleObject[userFieldName]
    const titleStyle = {
      marginBottom: 0,
      marginTop: 15,
      fontWeight: 700
    }

    return (
      <div>
        <p style={titleStyle}>{title}</p>
        <ListGroup style={{ marginBottom: 0 }}>
          {this.users()}
        </ListGroup>
        <Input
          type='email'
          label='Benutzer hinzufügen'
          value={newUser}
          onChange={this.onChangeNewEsWriter}
          onBlur={this.onBlurNewEsWriter}
          bsStyle={newEsWriterBsStyle} />
        {
          newUserAlert
          ? this.newUserAlert()
          : null
        }
      </div>
    )
  }
})