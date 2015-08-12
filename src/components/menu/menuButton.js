'use strict'

import app from 'ampersand-app'
import React from 'react'
import _ from 'lodash'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import MenuItem from 'react-bootstrap/lib/MenuItem'
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
    console.log('importPropertyCollection was clicked')
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

  replicate () {
    console.log('replicate button was clicked')
    app.Actions.loadPouchFromRemote()
  },

  openAdminPage () {
    console.log('openAdminPage was clicked')
  // TODO
  /* previously:
  require('./zeigeFormular')('admin')
  */
  },

  render () {
    const { object } = this.props
    const isObject = object && _.keys(object).length > 0
    const googleLink = isObject ? buildGoogleImageLink(object) : '#'
    const wikipediaLink = isObject ? buildWikipediaLink(object) : '#'

    return (
    <div id='menuBtn' className='btn-group menu'>
      <DropdownButton title='Menu' bsSize='small'>
        <li role='presentation' className='dropdown-header'>
          Mehr Infos zur Art:
        </li>
        <MenuItem onClick={this.searchGoogleImages} disabled={!isObject}>
          <a href={googleLink} target='_blank'>Auf google.ch Bilder suchen</a>
        </MenuItem>
        <MenuItem onClick={this.searchWikipediaArticle} disabled={!isObject}>
          <a href={wikipediaLink} target='_blank'>Auf wikipedia.org suchen</a>
        </MenuItem>
        <MenuItem divider/>
        <li role='presentation' className='dropdown-header'>
          Exportieren:
        </li>
        <MenuItem onClick={this.exportProperties}>
          Eigenschaften
        </MenuItem>
        <MenuItem divider/>
        <li role='presentation' className='dropdown-header'>
          Importieren oder löschen:
        </li>
        <MenuItem onClick={this.importPropertyCollection}>
          Eigenschaften
        </MenuItem>
        <MenuItem onClick={this.importRelationsCollection}>
          Beziehungen
        </MenuItem>
        <MenuItem divider/>
        <MenuItem onClick={this.replicate}>
          Daten replizieren
        </MenuItem>
        <MenuItem divider/>
        <MenuItem onClick={this.openAdminPage}>
          Administration
        </MenuItem>
        <MenuItem divider/>
        <li role='presentation' className='dropdown-header'>
          Über arteigenschaften.ch:
        </li>
        <MenuItem>
          <a href='//github.com/FNSKtZH/artendb/blob/master/README.md' target='_blank'>Projektbeschreibung</a>
        </MenuItem>
        <MenuItem>
          <a href='//github.com/FNSKtZH/artendb' target='_blank'>Code</a>
        </MenuItem>
        <MenuItem>
          <a href='//github.com/FNSKtZH/artendb/commits/master' target='_blank'>Letzte Änderungen</a>
        </MenuItem>
        <MenuItem>
          <a href='mailto:alex@gabriel-software.ch'>Email an Autor</a>
        </MenuItem>
        <MenuItem>
          <a href='https://twitter.com/arteigenschaft' target='_blank'>auf Twitter folgen</a>
        </MenuItem>
      </DropdownButton>
    </div>
    )
  }
})
