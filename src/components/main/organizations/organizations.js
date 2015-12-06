'use strict'

/**
 * when loading:
 * - get organizations from remoteDb
 * - filter the ones, this user is admin for
 * - list these in dropdown field
 * - preset activeOrganization if user is admin in only one
 */

import app from 'ampersand-app'
import React from 'react'
import _ from 'lodash'
import { PanelGroup, Panel, Input, Alert } from 'react-bootstrap'
import UsersList from './usersList.js'

export default React.createClass({
  displayName: 'Organizations',

  propTypes: {
    email: React.PropTypes.string,
    organizations: React.PropTypes.array,
    activeOrganization: React.PropTypes.object,
    onChangeActiveOrganization: React.PropTypes.func,
    userIsNotOrgAdmin: React.PropTypes.bool
  },

  componentDidMount () {
    const { email } = this.props
    if (!email) {
      const loginVariables = {
        logIn: true,
        email: undefined
      }
      app.Actions.login(loginVariables)
    }
    app.Actions.getOrganizations(email)
  },

  orgValues () {
    const { organizations, email } = this.props
    const orgWhereUserIsAdmin = organizations.filter((org) => org.orgAdmins.includes(email))
    const orgNamesWhereUserIsAdmin = _.pluck(orgWhereUserIsAdmin, 'Name')
    return orgNamesWhereUserIsAdmin.map((name, index) => <option key={index} value={name}>{name}</option>)
  },

  userIsNotOrgAdminAlert () {
    return (
      <Alert bsStyle='danger'>
        <strong>Sie sind in keiner Organisation Administrator.<br/>Daher wird auch keine angezeigt.</strong>
      </Alert>
    )
  },

  lowerPart () {
    const { activeOrganization, userIsNotOrgAdmin, email } = this.props
    return (
      <UsersList
        activeOrganization={activeOrganization}
        userFieldName='esWriters'
        userIsNotOrgAdmin={userIsNotOrgAdmin}
        email={email} />
    )
  },

  render () {
    const { onChangeActiveOrganization, userIsNotOrgAdmin, email } = this.props

    return (
      <div className='formContent'>
        <h4>Organisationen und Benutzer</h4>
        <PanelGroup defaultActiveKey='1' accordion>
          <Panel header='Organisationen' eventKey='1'>
            <Input
              type='select'
              label='Organisation'
              placeholder='bitte eine Organisation wählen'
              onChange={onChangeActiveOrganization}>
              { this.orgValues() }
            </Input>
            {
              email && !userIsNotOrgAdmin
              ? this.lowerPart()
              : null
            }
            {
              userIsNotOrgAdmin && email
              ? this.userIsNotOrgAdminAlert()
              : null
            }
          </Panel>
          <Panel header='Neuen Benutzer erfassen' eventKey='2'>
            testdata
          </Panel>
        </PanelGroup>
      </div>
    )
  }
})
