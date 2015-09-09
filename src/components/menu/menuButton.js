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
  // TODO
  /* previously:
  zeigeFormular('export')
  delete window.adb.exportierenObjekte*/
  },

  importPropertyCollection () {
    // console.log('importPropertyCollection was clicked')
    app.Actions.loadActivePathStore(['importieren', 'eigenschaften'])
  // testen, ob der Browser das Importieren unterstützt
  // wenn nein, melden
  // TODO
  /* previously:
  if (isFileAPIAvailable()) {
    zeigeFormular('importDs')
    // Ist der User noch angemeldet? Wenn ja: Anmeldung überspringen
    if (pruefeAnmeldung('ds')) {
      $('#importDsDsBeschreibenCollapse').collapse('show')
    }
  }
  */
  },

  importRelationsCollection () {
    console.log('importRelationsCollection was clicked')
  // testen, ob der Browser das Importieren unterstützt
  // wenn nein, melden
  // TODO
  /* previously:
  if (isFileAPIAvailable()) {
    zeigeFormular('importBs')
    // Ist der User noch angemeldet? Wenn ja: Anmeldung überspringen
    if (pruefeAnmeldung('bs')) {
      $('#importBsDsBeschreibenCollapse').collapse('show')
    }
  }
  */
  },

  openOrganisationen () {
    // console.log('open Organisationen was clicked')
    app.Actions.loadActivePathStore(['organisationen_und_benutzer'])
    /*const loginVariables = {
      logIn: true,
      email: undefined
    }
    app.Actions.login(loginVariables)*/
  },

  replicateToAe () {
    app.Actions.replicateToAe()
  },

  replicateFromAe () {
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
            <MenuItem onClick={this.importRelationsCollection} disabled={true}>Beziehungen</MenuItem>
          </DropdownButton>
          <DropdownButton title='Mehr...' bsSize='small' onSelect={this.onSelectDropdowButton()}>
            <MenuItem onClick={this.openOrganisationen}>Organisationen und Benutzer</MenuItem>
            <MenuItem divider/>
            <MenuItem onClick={this.replicateFromAe}>Daten von arteigenschaften.ch replizieren</MenuItem>
            <MenuItem onClick={this.replicateToAe}>Daten nach arteigenschaften.ch replizieren</MenuItem>
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
