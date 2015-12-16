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
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import { PanelGroup, Panel, Input, Alert } from 'react-bootstrap'
import UsersList from './usersList.js'
import CollectionList from './collectionList.js'

export default React.createClass({
  displayName: 'Organizations',

  mixins: [ListenerMixin],

  propTypes: {
    email: React.PropTypes.string,
    userRoles: React.PropTypes.array,
    organizations: React.PropTypes.array,
    activeOrganization: React.PropTypes.object,
    onChangeActiveOrganization: React.PropTypes.func,
    userIsAdminInOrgs: React.PropTypes.array,
    pcsOfOrganization: React.PropTypes.array,
    rcsOfOrganization: React.PropTypes.array
  },

  getInitialState () {
    return {
      pcsOfOrganization: [],
      rcsOfOrganization: []
    }
  },

  componentDidMount () {
    let { email } = this.props
    if (!email) {
      const logIn = true
      app.Actions.login({ logIn })
    }
    app.Actions.getOrganizations(email)
    this.listenTo(app.pcsOfOrganizationStore, this.onPcsOfOrganizationStoreChange)
    this.listenTo(app.rcsOfOrganizationStore, this.onRcsOfOrganizationStoreChange)
  },

  onPcsOfOrganizationStoreChange (pcsOfOrganization) {
    this.setState({ pcsOfOrganization })
  },

  onRcsOfOrganizationStoreChange (rcsOfOrganization) {
    this.setState({ rcsOfOrganization })
  },

  orgValues () {
    const { organizations, email } = this.props
    const orgWhereUserIsAdmin = organizations.filter((org) => org.orgAdmins.includes(email))
    const orgNamesWhereUserIsAdmin = _.pluck(orgWhereUserIsAdmin, 'Name')
    // orgNamesWhereUserIsAdmin.unshift(null)
    return orgNamesWhereUserIsAdmin.map((name, index) => (
      <option
        key={index}
        value={name}>
        {name}
      </option>
    ))
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
    const { pcsOfOrganization, rcsOfOrganization } = this.state
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
        {
          pcsOfOrganization.length > 0
          ? <CollectionList
            collections={pcsOfOrganization}
            cType='Eigenschaftensammlungen'
            orgName={activeOrganization.Name} />
          : null
        }
        {
          rcsOfOrganization.length > 0
          ? <CollectionList
            collections={rcsOfOrganization}
            cType='Beziehungssammlungen'
            orgName={activeOrganization.Name} />
          : null
        }
      </div>
    )
  },

  render () {
    const { onChangeActiveOrganization, userIsAdminInOrgs, email, activeOrganization } = this.props
    const showLowerPart = email && activeOrganization && userIsAdminInOrgs.includes(activeOrganization.Name)

    return (
      <div className='formContent'>
        <h4>
          Organisationen
        </h4>
        <PanelGroup
          defaultActiveKey='1'
          accordion>
          <Panel
            header='Organisation bearbeiten'
            eventKey='1'>
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
          <Panel
            header='Organisation hinzufügen oder entfernen'
            eventKey='2'>
            Diese Funktion ist (noch) nicht realisiert
          </Panel>
        </PanelGroup>
      </div>
    )
  }
})
