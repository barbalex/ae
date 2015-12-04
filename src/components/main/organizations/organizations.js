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
import { PanelGroup, Panel, Input, Glyphicon, ListGroup, ListGroupItem, OverlayTrigger, Tooltip } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Organizations',

  propTypes: {
    email: React.PropTypes.string,
    organizations: React.PropTypes.array,
    activeOrganization: React.PropTypes.object,
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
    app.Actions.getOrganizations(email)
  },

  orgValues () {
    const { organizations, email } = this.props
    const orgWhereUserIsAdmin = organizations.filter((org) => org.orgAdmins.includes(email))
    const orgNamesWhereUserIsAdmin = _.pluck(orgWhereUserIsAdmin, 'Name')
    return orgNamesWhereUserIsAdmin.map((name, index) => <option key={index} value={name}>{name}</option>)
  },

  removeEsWriter (esWriter) {
    app.Actions.removeEsWriterFromActiveOrganization(esWriter)
  },

  removeEsWriterTooltip () {
    return <Tooltip id='removeThisEsWriter'>entfernen</Tooltip>
  },

  removeEsWriterGlyph (esWriter) {
    const glyphStyle = {
      position: 'absolute',
      right: 10,
      top: 6,
      fontSize: 1.5 + 'em',
      color: 'red'
    }
    return (
      <OverlayTrigger
        placement='top'
        overlay={this.removeEsWriterTooltip()}>
        <Glyphicon
          glyph='remove-circle'
          style={glyphStyle}
          onClick={this.removeEsWriter.bind(this, esWriter)} />
      </OverlayTrigger>
    )
  },

  esWriters () {
    const { activeOrganization } = this.props
    const glyphStyle = {
      position: 'absolute',
      top: 11,
      marginLeft: 10,
      fontSize: 1.3 + 'em',
      color: 'red',
      cursor: 'pointer'
    }
    const liStyle = {
      // position: 'relative'
    }

    if (activeOrganization && activeOrganization.esWriters) {
      return activeOrganization.esWriters.map((esWriter, index) => (
        <ListGroupItem key={index} style={liStyle}>
          {esWriter}
          {this.removeEsWriterGlyph(esWriter)}
        </ListGroupItem>
      ))
    }
    return null
  },

  render () {
    const { onChangeActiveOrganization } = this.props
    const labelStyle = {
      marginBottom: 0
    }

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
            <div className='emailList'>
              <p style={labelStyle}>Benutzer mit Schreibrecht für Eigenschaften- und Beziehungssammlungen</p>
              <ListGroup>
                {this.esWriters()}
              </ListGroup>
            </div>

          </Panel>
          <Panel header='Neuen Benutzer erfassen' eventKey='2'>
            testdata
          </Panel>
        </PanelGroup>
      </div>
    )
  }
})
