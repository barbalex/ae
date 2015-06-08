'use strict'

import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import MenuItem from 'react-bootstrap/lib/MenuItem'
// import searchGoogleImagesOfObject from '../searchGoogleImages'
// import searchWikipediaArticlesOfObject from '../searchWikipediaArticles'

export default React.createClass({
  displayName: 'MenuButton',

  getInitialState () {
    return {
      // TODO:
      // remove disabled property of google- and wikipedia-search-buttons when an object is displayed
      // set Visibility of admin button and it's following divider
    }
  },

  searchGoogleImages () {
    console.log('searchGoogleImages was clicked')
    // TODO: use props to pass object
    // searchGoogleImagesOfObject(object)
  },

  searchWikipediaArticle () {
    console.log('searchWikipediaArticle was clicked')
    // TODO: use props to pass object
    // searchWikipediaArticlesOfObject(object)
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

  openAdminPage () {
    console.log('openAdminPage was clicked')
    // TODO
    /* previously:
    require('./zeigeFormular')('admin')
    */
  },

  render () {
    return (
      <div>
        <div id='menuBtn' className='btn-group menu'>
          <DropdownButton title='Menu' bsSize='small'>
            <li role='presentation' className='dropdown-header'>Mehr Infos zur Art:</li>
            <MenuItem onClick={this.searchGoogleImages} disabled>Auf google.ch Bilder suchen</MenuItem>
            <MenuItem onClick={this.searchWikipediaArticle} disabled>Auf wikipedia.org suchen</MenuItem>
            <MenuItem divider/>
            <li role='presentation' className='dropdown-header'>Exportieren:</li>
            <MenuItem onClick={this.exportProperties}>Eigenschaften</MenuItem>
            <MenuItem divider/>
            <li role='presentation' className='dropdown-header'>Importieren oder löschen:</li>
            <MenuItem onClick={this.importPropertyCollection}>Eigenschaften</MenuItem>
            <MenuItem onClick={this.importRelationsCollection}>Beziehungen</MenuItem>
            <MenuItem divider/>
            <MenuItem onClick={this.openAdminPage}>Administration</MenuItem>
            <MenuItem divider/>
            <li role='presentation' className='dropdown-header'>Über arteigenschaften.ch:</li>
            <MenuItem><a href='//github.com/FNSKtZH/artendb/blob/master/README.md' target='_blank'>Projektbeschreibung</a></MenuItem>
            <MenuItem><a href='//github.com/FNSKtZH/artendb' target='_blank'>Code</a></MenuItem>
            <MenuItem><a href='//github.com/FNSKtZH/artendb/commits/master' target='_blank'>Letzte Änderungen</a></MenuItem>
            <MenuItem><a href='mailto:alex@gabriel-software.ch'>Email an Autor</a></MenuItem>
            <MenuItem><a href='https://twitter.com/arteigenschaft' target='_blank'>auf Twitter folgen</a></MenuItem>
          </DropdownButton>
        </div>
      </div>
    )
  }
})
