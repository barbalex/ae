'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap'
import InputIndexes from './inputIndexes.js'
import buildGoogleImageLink from '../../../modules/buildGoogleImageLink.js'
import buildWikipediaLink from '../../../modules/buildWikipediaLink.js'
import rebuildObjectDerivedData from '../../../modules/rebuildObjectDerivedData.js'

export default React.createClass({
  displayName: 'MenuButton',

  propTypes: {
    object: React.PropTypes.object,
    offlineIndexes: React.PropTypes.bool,
    onClickToggleOfflineIndexes: React.PropTypes.func
  },

  exportProperties () {
    app.Actions.loadActivePath(['exportieren'])
  },

  importPropertyCollection () {
    app.Actions.loadActivePath(['importieren', 'eigenschaften'])
  },

  importRelationsCollection () {
    app.Actions.loadActivePath(['importieren', 'beziehungen'])
  },

  rebuildObjectDerivedData () {
    app.Actions.showError({title: 'Sorry, dieses Feature ist noch nicht implementiert'})
    rebuildObjectDerivedData()
  },

  openOrganisationen () {
    app.Actions.loadActivePath(['organisationen'])
  },

  replicateToRemoteDb () {
    app.Actions.replicateToRemoteDb()
  },

  replicateFromRemoteDb () {
    app.Actions.replicateFromRemoteDb()
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

  render () {
    const { object, offlineIndexes, onClickToggleOfflineIndexes } = this.props
    const isObject = object && Object.keys(object).length > 0
    const googleLink = isObject ? buildGoogleImageLink(object) : '#'
    const wikipediaLink = isObject ? buildWikipediaLink(object) : '#'

    return (
      <div id='menuBtn' className='btn-group menu'>
        <ButtonGroup>
          <Button
            onClick={this.searchGoogleImages}
            bsSize='small'
            disabled={!isObject}
            href={googleLink}
            target='_blank'>
            Bilder
          </Button>
          <Button
            onClick={this.searchWikipediaArticle}
            bsSize='small'
            disabled={!isObject}
            href={wikipediaLink}
            target='_blank'>
            Wikipedia
          </Button>
          <Button
            onClick={this.exportProperties}
            bsSize='small'>
            Export
          </Button>
          <DropdownButton
            id='importDropdown'
            title='Import'
            bsSize='small'>
            <MenuItem header>
              Importieren oder löschen:
            </MenuItem>
            <MenuItem
              onSelect={this.importPropertyCollection}>
              Eigenschaften
            </MenuItem>
            <MenuItem
              onSelect={this.importRelationsCollection}>
              Beziehungen
            </MenuItem>
          </DropdownButton>
          <DropdownButton
            id='moreDropdown'
            title='Mehr...'
            bsSize='small'>
            <MenuItem
              onSelect={this.openOrganisationen}>
              Organisationen
            </MenuItem>
            <MenuItem divider/>
            <MenuItem header>
              Daten:
            </MenuItem>
            <MenuItem
              onSelect={this.loadPouchFromRemote}>
              Fehlende Gruppen laden
            </MenuItem>
            <MenuItem
              onSelect={this.replicateFromRemoteDb}>
              <strong>Von</strong> arteigenschaften.ch replizieren
            </MenuItem>
            <MenuItem
              onSelect={this.replicateToRemoteDb}>
              <strong>Nach</strong> arteigenschaften.ch replizieren
            </MenuItem>
            <MenuItem divider/>
            <MenuItem
              onSelect={this.rebuildObjectDerivedData}>
              Von den Objekten abhängige Daten neu aufbauen
            </MenuItem>
            <MenuItem divider/>
            <MenuItem header>
              Indizes:
            </MenuItem>
            <InputIndexes
              offlineIndexes={offlineIndexes}
              onClickToggleOfflineIndexes={onClickToggleOfflineIndexes} />
            <MenuItem divider/>
            <MenuItem
              onSelect={this.openAdminPage}
              disabled>
              Administration
            </MenuItem>
            <MenuItem divider/>
            <MenuItem header>
              Über arteigenschaften.ch:
            </MenuItem>
            <MenuItem
              href='//github.com/FNSKtZH/artendb/blob/master/README.md'
              target='_blank'>
              Projekt-Beschreibung
            </MenuItem>
            <MenuItem
              href='//github.com/FNSKtZH/artendb'
              target='_blank'>
              Code
            </MenuItem>
            <MenuItem
              href='//github.com/FNSKtZH/artendb/commits/master'
              target='_blank'>
              Letzte Änderungen
            </MenuItem>
            <MenuItem
              href='mailto:alex@gabriel-software.ch'>
              Email an Autor
            </MenuItem>
            <MenuItem
              href='https://twitter.com/arteigenschaft'
              target='_blank'>
              auf Twitter folgen
            </MenuItem>
          </DropdownButton>
        </ButtonGroup>
      </div>
    )
  }
})
