'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Organizations',

  propTypes: {
    userEmail: React.PropTypes.string
  },

  render () {
    console.log('organizations.js, render')
    return (
      <div>
        <h4>Organisationen und Benutzer</h4>
        <Accordion>
          <Panel header='Neue Benutzer erfassen' eventKey='1'>
            testdata
          </Panel>
          <Panel header='Organisation verwalten' eventKey='2'>
            testdata
          </Panel>
        </Accordion>
      </div>
    )
  }
})
