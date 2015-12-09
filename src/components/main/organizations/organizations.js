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
    userIsAdminInOrgs: React.PropTypes.array,
    pcsOfOrganization: React.PropTypes.array
  },

  getInitialState () {
    return {
      pcsOfOrganization: []
    }
  },

  componentDidMount () {
    let { email } = this.props
    if (!email) {
      const logIn = true
      email = undefined
      app.Actions.login({ logIn, email })
    }
    app.Actions.getOrganizations(email)
  },

  /*
  shouldComponentUpdate () {
    const { activeOrganization } = this.props
    if (activeOrganization && activeOrganization.Name) {
      const pcsOfOrganization = app.propertyCollectionsStore.getPcsOfOrganization(activeOrganization.Name)
      this.setState({ pcsOfOrganization })
    }
    return true
  },*/

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
    const { activeOrganization } = this.props
    return (
      <div>
        <UsersList
          activeOrganization={activeOrganization}
          userFieldName='esWriters' />
        <UsersList
          activeOrganization={activeOrganization}
          userFieldName='lrWriters' />
        <UsersList
          activeOrganization={activeOrganization}
          userFieldName='orgAdmins' />
      </div>
    )
  },

  render () {
    const { onChangeActiveOrganization, userIsAdminInOrgs, email, activeOrganization } = this.props
    const { pcsOfOrganization } = this.state
    const showLowerPart = email && activeOrganization && userIsAdminInOrgs.includes(activeOrganization.Name)

    console.log('pcsOfOrganization', pcsOfOrganization)

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
              showLowerPart
              ? this.lowerPart()
              : null
            }
            {
              !showLowerPart
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
