'use strict'

import app from 'ampersand-app'
import React from 'react'
import _ from 'lodash'
import { Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap'
import buildGoogleImageLink from '../../modules/buildGoogleImageLink.js'
import buildWikipediaLink from '../../modules/buildWikipediaLink.js'

export default React.createClass({
  displayName: 'MenuButton',

  propTypes: {
    object: React.PropTypes.object
  },

  exportProperties () {
    console.log('exportProperties was clicked')
  },

  importPropertyCollection () {
    app.Actions.loadActivePathStore(['importieren', 'eigenschaften'])
  },

  importRelationsCollection () {
    // console.log('importRelationsCollection was clicked')
    app.Actions.loadActivePathStore(['importieren', 'beziehungen'])
  },

  openOrganisationen () {
    app.Actions.loadActivePathStore(['organisationen_und_benutzer'])
  },

  replicateToAe () {
    app.Actions.replicateToAe()
  },

  replicateFromAe () {
    app.Actions.replicateFromAe()
  },

  loadPouchFromRemote () {
    app.Actions.loadPouchFromRemote()
  },

  openAdminPage () {
    console.log('openAdminPage was clicked')
  // TODO
  /* previously:
  require('./zeigeFormular')('admin')
  */
  },

  onSelectDropdowButton () {
    // make sure, the menu closes
    return () => true
  },

  render () {
    const { object } = this.props
    const isObject = object && _.keys(object).length > 0
    const googleLink = isObject ? buildGoogleImageLink(object) : '#'
    const wikipediaLink = isObject ? buildWikipediaLink(object) : '#'

    return (
      <div id='menuBtn' className='btn-group menu'>
        <ButtonGroup>
          <Button onClick={this.searchGoogleImages} bsSize='small' disabled={!isObject} href={googleLink} target='_blank'>Bilder</Button>
          <Button onClick={this.searchWikipediaArticle} bsSize='small' disabled={!isObject} href={wikipediaLink} target='_blank'>Wikipedia</Button>
          <Button onClick={this.exportProperties} bsSize='small' disabled={true}>Export</Button>
          <DropdownButton title='Import' bsSize='small' onSelect={this.onSelectDropdowButton()}>
            <li role='presentation' className='dropdown-header'>Importieren oder löschen:</li>
            <MenuItem onClick={this.importPropertyCollection}>Eigenschaften</MenuItem>
            <MenuItem onClick={this.importRelationsCollection}>Beziehungen</MenuItem>
          </DropdownButton>
          <DropdownButton title='Mehr...' bsSize='small' onSelect={this.onSelectDropdowButton()}>
            <MenuItem onClick={this.openOrganisationen}>Organisationen und Benutzer</MenuItem>
            <MenuItem divider/>
            <li role='presentation' className='dropdown-header'>Daten:</li>
            <MenuItem onClick={this.loadPouchFromRemote}>Fehlende Gruppen laden</MenuItem>
            <MenuItem onClick={this.replicateFromAe}><strong>Von</strong> arteigenschaften.ch replizieren</MenuItem>
            <MenuItem onClick={this.replicateToAe}><strong>Nach</strong> arteigenschaften.ch replizieren</MenuItem>
            <MenuItem divider/>
            <MenuItem onClick={this.openAdminPage} disabled={true}>Administration</MenuItem>
            <MenuItem divider/>
            <li role='presentation' className='dropdown-header'>Über arteigenschaften.ch:</li>
            <MenuItem href='//github.com/FNSKtZH/artendb/blob/master/README.md' target='_blank'>Projekt-Beschreibung</MenuItem>
            <MenuItem href='//github.com/FNSKtZH/artendb' target='_blank'>Code</MenuItem>
            <MenuItem href='//github.com/FNSKtZH/artendb/commits/master' target='_blank'>Letzte Änderungen</MenuItem>
            <MenuItem href='mailto:alex@gabriel-software.ch'>Email an Autor</MenuItem>
            <MenuItem href='https://twitter.com/arteigenschaft' target='_blank'>auf Twitter folgen</MenuItem>
          </DropdownButton>
        </ButtonGroup>
      </div>
    )
  }
})
