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
import { Accordion, Panel } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Organizations',

  propTypes: {
    email: React.PropTypes.string,
    organizations: React.PropTypes.array
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
    app.Actions.getOrganizations()
  },

  render () {
    const { organizations } = this.props
    return (
      <div className='formContent'>
        <h4>Organisationen und Benutzer</h4>
        <Accordion>
          <Panel header='Organisationen' eventKey='1'>
            testdata
          </Panel>
          <Panel header='Neuen Benutzer erfassen' eventKey='2'>
            testdata
          </Panel>
        </Accordion>
      </div>
    )
  }
})
