'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Organizations',

  propTypes: {
    userEmail: React.PropTypes.string
  },

  componentDidMount () {
    if (!app.email) {

    }
  },

  render () {
    return (
      <div>
        <h4>Organisationen und Benutzer</h4>
        <Accordion>
          <Panel header='Organisation' eventKey='1'>
            testdata
          </Panel>
          <Panel header='Benutzer' eventKey='2'>
            testdata
          </Panel>
        </Accordion>
      </div>
    )
  }
})
