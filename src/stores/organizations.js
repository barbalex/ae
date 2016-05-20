'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import { map, union } from 'lodash'
import removeRolesFromUser from '../components/main/organizations/removeRolesFromUser.js'
import getRoleFromOrgField from '../components/main/organizations/getRoleFromOrgField.js'

export default (Actions) => {
  const organizationsStore = Reflux.createStore({
    /**
     * used to manage organizations or rather: writers and admins of organizations
     */
    listenables: Actions,

    organizations: [],

    lastOrganizations: [],

    activeOrganizationName: null,

    tcsOfActiveOrganization: [],

    pcsOfActiveOrganization: [],

    rcsOfActiveOrganization: [],

    userIsAdminInOrgs: [],

    userIsEsWriterInOrgs: [],

    getActiveOrganization() {
      return this.organizations.find((org) =>
        org.Name === this.activeOrganizationName
      )
    },

    updateOrganizationByName(name, organization) {
      const index = this.organizations.findIndex((org) =>
        org.Name === name
      )
      this.lastOrganizations = this.organizations
      this.organizations[index] = organization
      // optimistically update ui
      this.triggerMe()
      app.remoteDb.put(organization)
        .then((result) => {
          // update rev in cache
          organization._rev = result.rev
          this.organizations[index] = organization
          this.triggerMe()
        })
        .catch((error) => {
          app.Actions.showError({
            title: 'error updating esWriter in remoteDb:',
            msg: error.message
          })
          // roll back change in cache
          this.organizations = this.lastOrganizations
        })
    },

    onGetOrganizations(email) {
      // send cached organizations first
      if (this.organizations.length > 0) this.triggerMe()
      app.remoteDb.query('organizations', { include_docs: true })
        .then((result) => {
          this.userIsAdminInOrgs = []
          this.userIsEsWriterInOrgs = []
          const organizations = result.rows.map((row) => row.doc)
          this.organizations = organizations
          // is user admin in orgs?
          const orgsWhereUserIsAdmin = organizations.filter((org) => org.orgAdmins.includes(email))
          this.userIsAdminInOrgs = map(orgsWhereUserIsAdmin, 'Name')
          // set activeOrganization if user is logged in and only admin in one organization
          if (this.userIsAdminInOrgs.length === 1) {
            this.activeOrganizationName = this.userIsAdminInOrgs[0]
            app.Actions.getTcsOfOrganization(this.activeOrganizationName)
            app.Actions.getPcsOfOrganization(this.activeOrganizationName)
            app.Actions.getRcsOfOrganization(this.activeOrganizationName)
          }
          // is user es-writer in orgs?
          let orgsWhereUserIsEsWriter = organizations.filter((org) => org.esWriters.includes(email))
          orgsWhereUserIsEsWriter = union(orgsWhereUserIsEsWriter, orgsWhereUserIsAdmin)
          this.userIsEsWriterInOrgs = map(orgsWhereUserIsEsWriter, 'Name')
          // is user lr-writer in orgs?
          let orgsWhereUserLrEsWriter = organizations.filter((org) => org.lrWriters.includes(email))
          orgsWhereUserLrEsWriter = union(orgsWhereUserLrEsWriter, orgsWhereUserIsAdmin)
          this.triggerMe()
        })
        .catch((error) =>
          app.Actions.showError({
            title: 'error fetching organizations from remoteDb:',
            msg: error
          })
        )
    },

    onUpdateActiveOrganization(name, organization) {
      this.updateOrganizationByName(name, organization)
    },

    onSetActiveOrganization(name) {
      this.activeOrganizationName = name
      this.triggerMe()
    },

    onRemoveUserFromActiveOrganization(user, userFieldName) {
      const activeOrganization = this.getActiveOrganization()
      if (activeOrganization[userFieldName]) {
        const roles = []
        const role = getRoleFromOrgField(activeOrganization, userFieldName)
        roles.push(role)
        removeRolesFromUser(user, roles)
          .then(() => {
            activeOrganization[userFieldName] = activeOrganization[userFieldName].filter((esW) => esW !== user)
            this.updateOrganizationByName(activeOrganization.Name, activeOrganization)
          })
          .catch(() => {
            // TODO
          })
      } else {
        // TODO
      }
    },

    onGetTcsOfOrganization(orgName) {
      app.taxonomyCollectionsStore.getTcs()
        .then((tcs) => {
          this.tcsOfActiveOrganization = tcs.filter((tc) => tc.organization === orgName)
          this.triggerMe()
        })
        .catch((error) =>
          app.Actions.showError({
            title: `organizationsStore, error getting existing tcs of ${orgName}:`,
            msg: error
          })
        )
    },

    onGetPcsOfOrganization(orgName) {
      app.propertyCollectionsStore.getPcs()
        .then((pcs) => {
          this.pcsOfActiveOrganization = pcs.filter((pc) =>
            pc.organization === orgName
          )
          this.triggerMe()
        })
        .catch((error) =>
          app.Actions.showError({
            title: `organizationsStore, error getting existing pcs of ${orgName}:`,
            msg: error
          })
        )
    },

    onGetRcsOfOrganization(orgName) {
      app.relationCollectionsStore.getRcs()
        .then((rcs) => {
          this.rcsOfActiveOrganization = rcs.filter((pc) =>
            pc.organization === orgName
          )
          this.triggerMe()
        })
        .catch((error) =>
          app.Actions.showError({
            title: `organizationsStore, error getting existing rcs of ${orgName}:`,
            msg: error
          })
        )
    },

    triggerMe() {
      const organizations = this.organizations
      const activeOrganization = this.getActiveOrganization()
      const userIsAdminInOrgs = this.userIsAdminInOrgs
      const userIsEsWriterInOrgs = this.userIsEsWriterInOrgs
      const tcsOfActiveOrganization = this.tcsOfActiveOrganization
      const pcsOfActiveOrganization = this.pcsOfActiveOrganization
      const rcsOfActiveOrganization = this.rcsOfActiveOrganization
      this.trigger({
        organizations,
        activeOrganization,
        userIsAdminInOrgs,
        userIsEsWriterInOrgs,
        tcsOfActiveOrganization,
        pcsOfActiveOrganization,
        rcsOfActiveOrganization
      })
    }
  })

  return organizationsStore
}
