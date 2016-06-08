/*
 * converting this to an es6 function
 * leads to the app starting blank
 * nothing is added to the app div!!!
 */

import app from 'ampersand-app'
import React from 'react'
import {
  Button,
  ButtonGroup,
  DropdownButton,
  MenuItem
} from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'
import buildGoogleImageLink from '../../../modules/buildGoogleImageLink.js'
import buildWikipediaLink from '../../../modules/buildWikipediaLink.js'

const styles = StyleSheet.create({
  btnGroup: {
    zIndex: 2
  },
  anyButton: {
    ':focus': {
      outline: 'none'
    }
  }
})

export default React.createClass({
  displayName: 'MenuButton',

  propTypes: {
    object: React.PropTypes.object,
  },

  render() {
    const {
      object,
    } = this.props
    const isObject = object && Object.keys(object).length > 0
    const googleLink = isObject ? buildGoogleImageLink(object) : '#'
    const wikipediaLink = isObject ? buildWikipediaLink(object) : '#'

    return (
      <div
        className={css(styles.btnGroup)}
      >
        <ButtonGroup>
          <Button
            onClick={this.searchGoogleImages}
            bsSize="small"
            disabled={!isObject}
            href={googleLink}
            target="_blank"
            className={css(styles.anyButton)}
          >
            Bilder
          </Button>
          <Button
            onClick={this.searchWikipediaArticle}
            bsSize="small"
            disabled={!isObject}
            href={wikipediaLink}
            target="_blank"
            className={css(styles.anyButton)}
          >
            Wikipedia
          </Button>
          <Button
            onClick={() =>
              app.Actions.loadActivePath(['exportieren'])
            }
            bsSize="small"
            className={css(styles.anyButton)}
          >
            Export
          </Button>
          <DropdownButton
            id="importDropdown"
            title="Import"
            bsSize="small"
            className={css(styles.anyButton)}
          >
            <MenuItem header>
              Importieren oder löschen:
            </MenuItem>
            <MenuItem
              onSelect={() =>
                app.Actions.loadActivePath(['importieren', 'eigenschaften'])
              }
            >
              Eigenschaften
            </MenuItem>
            <MenuItem
              onSelect={() =>
                app.Actions.loadActivePath(['importieren', 'beziehungen'])
              }
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
              onSelect={() =>
                app.Actions.loadActivePath(['organisationen'])
              }
            >
              Organisationen
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
