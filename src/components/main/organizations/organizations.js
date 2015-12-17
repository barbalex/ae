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
import CollectionList from './collectionList.js'

export default React.createClass({
  displayName: 'Organizations',

  propTypes: {
    email: React.PropTypes.string,
    offlineIndexes: React.PropTypes.bool,
    userRoles: React.PropTypes.array,
    organizations: React.PropTypes.array,
    activeOrganization: React.PropTypes.object,
    onChangeActiveOrganization: React.PropTypes.func,
    userIsAdminInOrgs: React.PropTypes.array,
    tcsOfActiveOrganization: React.PropTypes.array,
    pcsOfActiveOrganization: React.PropTypes.array,
    rcsOfActiveOrganization: React.PropTypes.array
  },

  componentDidMount () {
    let { email, offlineIndexes } = this.props
    if (!email) {
      const logIn = true
      app.Actions.login({ logIn })
    }
    app.Actions.getOrganizations(email)
    app.Actions.queryTaxonomyCollections(offlineIndexes)
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

  titelStyle () {
    return {
      marginTop: 20,
      fontWeight: 600,
      fontSize: 'large'
    }
  },

  lowerPart () {
    const { activeOrganization, tcsOfActiveOrganization, pcsOfActiveOrganization, rcsOfActiveOrganization } = this.props
    const lr = _.uniq(tcsOfActiveOrganization.filter((tcs) => tcs.group === 'Lebensräume'), (tc) => tc.name)
    const nonLrTcs = _.uniq(tcsOfActiveOrganization.filter((tcs) => tcs.group !== 'Lebensräume'), (tc) => tc.name)
    const showDatenTitel = tcsOfActiveOrganization.length > 0 || pcsOfActiveOrganization.length > 0 || rcsOfActiveOrganization.length > 0

    return (
      <div>
        <p style={this.titelStyle()}>Benutzerrechte</p>
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
          showDatenTitel
          ? <p style={this.titelStyle()}>Daten, bei denen {activeOrganization.Name} "Organisation mit Schreibrecht" ist</p>
          : null
        }
        {
          nonLrTcs.length > 0
          ? <CollectionList
            collections={nonLrTcs}
            cType='Taxonomiensammlungen'
            orgName={activeOrganization.Name} />
          : null
        }
        {
          lr.length > 0
          ? <CollectionList
            collections={lr}
            cType='Lebensräume'
            orgName={activeOrganization.Name} />
          : null
        }
        {
          pcsOfActiveOrganization.length > 0
          ? <CollectionList
            collections={pcsOfActiveOrganization}
            cType='Eigenschaftensammlungen'
            orgName={activeOrganization.Name} />
          : null
        }
        {
          rcsOfActiveOrganization.length > 0
          ? <CollectionList
            collections={rcsOfActiveOrganization}
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
