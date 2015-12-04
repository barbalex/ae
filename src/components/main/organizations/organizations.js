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
import { Accordion, Panel, Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Organizations',

  propTypes: {
    email: React.PropTypes.string,
    organizations: React.PropTypes.array,
    activeOrganization: React.PropTypes.string,
    onChangeActiveOrganization: React.PropTypes.func
  },

  /*
  getInitialState () {
    return {
      activeOrganization: null
    }
  },*/

  componentDidMount () {
    const { email } = this.props
    if (!email) {
      const loginVariables = {
        logIn: true,
        email: undefined
      }
      app.Actions.login(loginVariables)
    }
    app.Actions.getOrganizations()
  },

  orgValues () {
    const { organizations, email } = this.props
    const orgWhereUserIsAdmin = organizations.filter((org) => org.orgAdministratoren.includes(email))
    const orgNamesWhereUserIsAdmin = _.pluck(orgWhereUserIsAdmin, 'Name')
    return orgNamesWhereUserIsAdmin.map((name, index) => <option key={index} value={name}>{name}</option>)
  },

  render () {
    const { organizations, activeOrganization, onChangeActiveOrganization } = this.props

    return (
      <div className='formContent'>
        <h4>Organisationen und Benutzer</h4>
        <Accordion>
          <Panel header='Organisationen' eventKey='1'>
            <Input
              type='select'
              label='Organisation'
              placeholder='bitte eine Organisation wählen'
              onChange={onChangeActiveOrganization}>
              { this.orgValues() }
            </Input>
          </Panel>
          <Panel header='Neuen Benutzer erfassen' eventKey='2'>
            testdata
          </Panel>
        </Accordion>
      </div>
    )
  }
})
