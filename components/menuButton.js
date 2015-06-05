'use strict'

import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
// import MenuItem from 'react-bootstrap/lib/MenuItem'

export default React.createClass({
  displayName: 'MenuButton',

  render () {
    return (
      <div>
        <div id='menuBtn' className='btn-group menu' style={{/*display: 'none'*/}}>
          <DropdownButton title='Menu'>
            <li role='presentation' className='dropdown-header'>Mehr Infos zur Art:</li>
            <li id='GoogleBilderLink_li' className='disabled externer_menu_link'><a id='GoogleBilderLink' href='' target='_blank'>Auf google.ch Bilder suchen</a></li>
            <li id='WikipediaLink_li' className='disabled externer_menu_link'><a id='WikipediaLink' href='' target='_blank'>Auf wikipedia.org suchen</a></li>
            <li role='presentation' className='divider'></li>
            <li role='presentation' className='dropdown-header'>Exportieren:</li>
            <li><a id='menuExportieren' href='#'>Eigenschaften</a></li>
            <li role='presentation' className='divider'></li>
            <li role='presentation' className='dropdown-header'>Importieren oder löschen:</li>
            <li><a id='menuDsImportieren' href='#'>Eigenschaften</a></li>
            <li><a id='bsImportieren' href='#'>Beziehungen</a></li>
            <li role='presentation' className='divider'></li>
            <li className='admin'><a id='menuAdmin' href='#'>Administration</a></li>
            <li role='presentation' className='divider admin'></li>
            <li role='presentation' className='dropdown-header'>Über arteigenschaften.ch:</li>
            <li><a href='//github.com/FNSKtZH/artendb/blob/master/README.md' target='_blank'>Projektbeschreibung</a></li>
            <li><a href='//github.com/FNSKtZH/artendb' target='_blank'>Code</a></li>
            <li><a href='//github.com/FNSKtZH/artendb/commits/master' target='_blank'>Letzte Änderungen</a></li>
            <li><a href='mailto:alex@gabriel-software.ch'>Email an Autor</a></li>
            <li><a href='https://twitter.com/arteigenschaft' className='twitter-follow-button' data-lang='de' data-dnt='true'>@arteigenschaft folgen</a></li>
          </DropdownButton>
        </div>
      </div>
    )
  }
})