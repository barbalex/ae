'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap'
import InputIndexes from './inputIndexes.js'
import buildGoogleImageLink from '../../../modules/buildGoogleImageLink.js'
import buildWikipediaLink from '../../../modules/buildWikipediaLink.js'
import ObjectDerivedDataMenuItem from './objectDerivedDataMenuItem.js'

export default React.createClass({
  displayName: 'MenuButton',

  propTypes: {
    object: React.PropTypes.object,
    offlineIndexes: React.PropTypes.bool,
    onClickToggleOfflineIndexes: React.PropTypes.func
  },

  render() {
    const { object, offlineIndexes, onClickToggleOfflineIndexes } = this.props
    const isObject = object && Object.keys(object).length > 0
    const googleLink = isObject ? buildGoogleImageLink(object) : '#'
    const wikipediaLink = isObject ? buildWikipediaLink(object) : '#'

    return (
      <div id="menuBtn" className="btn-group menu">
        <ButtonGroup>
          <Button
            onClick={this.searchGoogleImages}
            bsSize="small"
            disabled={!isObject}
            href={googleLink}
            target="_blank"
          >
            Bilder
          </Button>
          <Button
            onClick={this.searchWikipediaArticle}
            bsSize="small"
            disabled={!isObject}
            href={wikipediaLink}
            target="_blank"
          >
            Wikipedia
          </Button>
          <Button
            onClick={() => app.Actions.loadActivePath(['exportieren'])}
            bsSize="small"
          >
            Export
          </Button>
          <DropdownButton
            id="importDropdown"
            title="Import"
            bsSize="small"
          >
            <MenuItem header>
              Importieren oder löschen:
            </MenuItem>
            <MenuItem
              onSelect={() => app.Actions.loadActivePath(['importieren', 'eigenschaften'])}
            >
              Eigenschaften
            </MenuItem>
            <MenuItem
              onSelect={() => app.Actions.loadActivePath(['importieren', 'beziehungen'])}
            >
              Beziehungen
            </MenuItem>
          </DropdownButton>
          <DropdownButton
            id="moreDropdown"
            title="Mehr..."
            bsSize="small"
          >
            <MenuItem
              onSelect={() => app.Actions.loadActivePath(['organisationen'])}
            >
              Organisationen
            </MenuItem>
            <MenuItem divider />
            <MenuItem header>
              Daten:
            </MenuItem>
            <MenuItem
              onSelect={() => app.Actions.loadPouchFromRemote()}
            >
              Fehlende Gruppen laden
            </MenuItem>
            <MenuItem
              onSelect={() => app.Actions.replicateFromRemoteDb()}
            >
              <strong>Von</strong> arteigenschaften.ch replizieren
            </MenuItem>
            <MenuItem
              onSelect={() => app.Actions.replicateToRemoteDb()}
            >
              <strong>Nach</strong> arteigenschaften.ch replizieren
            </MenuItem>
            <MenuItem divider />
            <ObjectDerivedDataMenuItem />
            <MenuItem divider />
            <MenuItem header>
              Indizes:
            </MenuItem>
            <InputIndexes
              offlineIndexes={offlineIndexes}
              onClickToggleOfflineIndexes={onClickToggleOfflineIndexes}
            />
            <MenuItem divider />
            <MenuItem
              onSelect={() => {
                console.log('openAdminPage was clicked')
                // TODO
                /* previously:
                require('./zeigeFormular')('admin')
                */
              }}
              disabled
            >
              Administration
            </MenuItem>
            <MenuItem divider />
            <MenuItem header>
              Über arteigenschaften.ch:
            </MenuItem>
            <MenuItem
              href="//github.com/FNSKtZH/artendb/blob/master/README.md"
              target="_blank"
            >
              Projekt-Beschreibung
            </MenuItem>
            <MenuItem
              href="//github.com/FNSKtZH/artendb"
              target="_blank"
            >
              Code
            </MenuItem>
            <MenuItem
              href="//github.com/FNSKtZH/artendb/commits/master"
              target="_blank"
            >
              Letzte Änderungen
            </MenuItem>
            <MenuItem
              href="mailto:alex@gabriel-software.ch"
            >
              Email an Autor
            </MenuItem>
            <MenuItem
              href="https://twitter.com/arteigenschaft"
              target="_blank"
            >
              Auf Twitter folgen
            </MenuItem>
          </DropdownButton>
        </ButtonGroup>
      </div>
    )
  }
})
