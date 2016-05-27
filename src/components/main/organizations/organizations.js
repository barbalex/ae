'use strict'

/**
 * when loading:
 * - get organizations from remoteDb
 * - filter the ones this user is admin for
 * - list these in dropdown field
 * - preset activeOrganization if user is admin in only one
 */

import app from 'ampersand-app'
import React from 'react'
import { map, uniq } from 'lodash'
import {
  PanelGroup,
  Panel,
  FormGroup,
  ControlLabel,
  FormControl,
  Alert
} from 'react-bootstrap'
import UsersList from './usersList.js'
import CollectionList from './collectionList.js'

const titleStyle = {
  marginTop: 20,
  fontWeight: 600,
  fontSize: 'large'
}

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

  componentDidMount() {
    const { email, offlineIndexes } = this.props
    if (!email) {
      const logIn = true
      app.Actions.login({ logIn })
    }
    app.Actions.getOrganizations(email)
    app.Actions.queryTaxonomyCollections(offlineIndexes)
    app.Actions.queryPropertyCollections(offlineIndexes)
    app.Actions.queryRelationCollections(offlineIndexes)
  },

  orgValues() {
    const { organizations, email } = this.props
    const orgWhereUserIsAdmin = organizations.filter((org) =>
      org.orgAdmins.includes(email)
    )
    const orgNamesWhereUserIsAdmin = map(orgWhereUserIsAdmin, 'Name')
    return orgNamesWhereUserIsAdmin.map((name, index) =>
      <option
        key={index}
        value={name}
      >
        {name}
      </option>
    )
  },

  lowerPart() {
    const {
      activeOrganization,
      tcsOfActiveOrganization,
      pcsOfActiveOrganization,
      rcsOfActiveOrganization
    } = this.props
    const lr = uniq(
      tcsOfActiveOrganization.filter((tcs) =>
        tcs.group === 'Lebensräume'
      ),
      (tc) => tc.name
    )
    const nonLrTcs = uniq(
      tcsOfActiveOrganization.filter((tcs) =>
        tcs.group !== 'Lebensräume'
      ),
      (tc) => tc.name
    )
    const showDatenTitel = (
      tcsOfActiveOrganization.length > 0 ||
      pcsOfActiveOrganization.length > 0 ||
      rcsOfActiveOrganization.length > 0
    )

    return (
      <div>
        <p
          style={titleStyle}
        >
          Benutzerrechte
        </p>
        <UsersList
          activeOrganization={activeOrganization}
          userFieldName="esWriters"
        />
        <UsersList
          activeOrganization={activeOrganization}
          userFieldName="lrWriters"
        />
        <UsersList
          activeOrganization={activeOrganization}
          userFieldName="orgAdmins"
        />
        {
          showDatenTitel &&
          <p style={titleStyle}>
            Daten, bei denen {activeOrganization.Name} "Organisation mit Schreibrecht" ist
          </p>
        }
        {
          nonLrTcs.length > 0 &&
          <CollectionList
            collections={nonLrTcs}
            cType="Taxonomiensammlungen"
          />
        }
        {
          lr.length > 0 &&
          <CollectionList
            collections={lr}
            cType="Lebensräume"
          />
        }
        {
          pcsOfActiveOrganization.length > 0 &&
          <CollectionList
            collections={pcsOfActiveOrganization}
            cType="Eigenschaftensammlungen"
          />
        }
        {
          rcsOfActiveOrganization.length > 0 &&
          <CollectionList
            collections={rcsOfActiveOrganization}
            cType="Beziehungssammlungen"
          />
        }
      </div>
    )
  },

  render() {
    const {
      onChangeActiveOrganization,
      userIsAdminInOrgs,
      email,
      activeOrganization
    } = this.props
    const showLowerPart = (
      email &&
      activeOrganization &&
      userIsAdminInOrgs.includes(activeOrganization.Name)
    )

    return (
      <div
        id="organisationen"
        className="formContent"
      >
        <h4>
          Organisationen
        </h4>
        <PanelGroup
          defaultActiveKey={1}
          accordion
        >
          <Panel
            header="Organisation bearbeiten"
            eventKey={1}
          >
            <FormGroup
              id="organizationInput"
            >
              <ControlLabel>
                Organisation
              </ControlLabel>
              <FormControl
                componentClass="select"
                placeholder="bitte eine Organisation wählen"
                onChange={onChangeActiveOrganization}
              >
                {this.orgValues()}
              </FormControl>
            </FormGroup>
            {
              showLowerPart ?
              this.lowerPart() :
              <Alert bsStyle="danger">
                <strong>
                  Sie sind in keiner Organisation Administrator.<br />
                  Daher wird auch keine angezeigt.
                </strong>
              </Alert>
            }
          </Panel>
          <Panel
            header="Organisation hinzufügen oder entfernen"
            eventKey={2}
          >
            Diese Funktion ist (noch) nicht realisiert
          </Panel>
        </PanelGroup>
      </div>
    )
  }
})
