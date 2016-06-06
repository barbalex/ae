/*
 * when the property or relation collection's properties are shown in the form
 * the user sees a short description of the property collection at the top
 * the user can expand this description
 * this component creates it
 */

'use strict'

import React from 'react'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  rootDiv: {
    color: '#944600',
    paddingBottom: '0.9em',
    /* sehr lange links müssen im Wort umbrechen können */
    wordWrap: 'break-word',
  },
  line: {
    display: 'flex',
    flexDirection: 'row',
  },
  label: {
    width: 215,
    wordWrap: 'break-word',
  },
  description: {
    width: '20%',               // For old syntax, otherwise collapses
    flex: 1,                    // NEW, Spec - Opera 12.1, Firefox 20+
    marginLeft: 5,
  }
})

export default React.createClass({
  displayName: 'PcDescription',

  propTypes: {
    pc: React.PropTypes.object,
    isVisible: React.PropTypes.bool
  },

  getInitialState() {
    return {
      isVisible: false
    }
  },

  onClick(event) {
    event.preventDefault()
    const isVisible = !this.state.isVisible
    this.setState({ isVisible })
  },

  render() {
    const { pc } = this.props
    const { isVisible } = this.state
    let mehr = null

    const datenstand = (
      <div className={css(styles.line)}>
        <div className={css(styles.label)}>
          Stand:
        </div>
        <div className={css(styles.description)}>
          {pc.Datenstand}
        </div>
      </div>
    )

    const nutzunbsbedingungen = (
      <div className={css(styles.line)}>
        <div className={css(styles.label)}>
          Nutzungsbedingungen:
        </div>
        <div className={css(styles.description)}>
          {pc.Nutzungsbedingungen}
        </div>
      </div>
    )

    let link = null
    if (pc.Link) {
      link = (
        <div className={css(styles.line)}>
          <div className={css(styles.label)}>
            Link:
          </div>
          <div className={css(styles.description)}>
            <a
              href={pc.Link}
              target="_blank"
            >
              {pc.Link}
            </a>
          </div>
        </div>
      )
    }

    let organization = null
    if (pc['Organisation mit Schreibrecht']) {
      organization = (
        <div className={css(styles.line)}>
          <div className={css(styles.label)}>
            Organisation mit Schreibrecht:
          </div>
          <div className={css(styles.description)}>
            {pc['Organisation mit Schreibrecht']}
          </div>
        </div>
      )
    }

    let importiertVon = null
    if (pc['importiert von']) {
      importiertVon = (
        <div className={css(styles.line)}>
          <div className={css(styles.label)}>
            Importiert von:
          </div>
          <div className={css(styles.description)}>
            <a
              href={`mailto:${pc['importiert von']}`}
              target={'_blank'}
            >
              {pc['importiert von']}
            </a>
          </div>
        </div>
      )
    }

    let ursprungsEs = null
    if (pc.Ursprungsdatensammlung) {
      ursprungsEs = (
        <div className={css(styles.line)}>
          <div className={css(styles.label)}>
            Zus.-fassend:
          </div>
          <div className={css(styles.description)}>
            Diese Eigenschaftensammlung fasst die Daten mehrerer
            Eigenschaftensammlungen in einer zusammen.<br />
            Die angezeigten Informationen stammen aus {`"${pc.Ursprungsdatensammlung}"`}
          </div>
        </div>
      )
    } else {
      ursprungsEs = (
        <div className={css(styles.line)}>
          <div className={css(styles.label)}>
            Zus.-fassend:
          </div>
          <div className={css(styles.description)}>
            Diese Eigenschaftensammlung fasst die Daten mehrerer
            Eigenschaftensammlungen in einer zusammen.<br />
            Leider ist die Ursprungs-Eigenschaftensammlung nicht beschrieben
          </div>
        </div>
      )
    }

    if (
      pc.Datenstand ||
      pc.Nutzungsbedingungen ||
      pc.Link ||
      (pc.zusammenfassend && pc.Ursprungsdatensammlung)
    ) {
      mehr = (
        <span>
          <a
            href="#"
            onClick={this.onClick}
            className="showNextHidden"
          >
            {
              pc.Beschreibung ?
              (isVisible ? '...weniger' : '...mehr') :
              'Beschreibung der Datensammlung anzeigen'
            }
          </a>
          <div
            style={{ display: isVisible ? 'block' : 'none' }}
          >
            {
              pc.Datenstand &&
              datenstand
            }
            {
              pc.Nutzungsbedingungen &&
              nutzunbsbedingungen
            }
            {
              pc.Link &&
              link
            }
            {organization}
            {
              pc['importiert von'] &&
              importiertVon
            }
            {
              pc.zusammenfassend &&
              ursprungsEs
            }
          </div>
        </span>
      )
    }

    return (
      <div className={css(styles.rootDiv)}>
        <span style={{ marginRight: 3 }}>
          {pc.Beschreibung}
        </span>
        {mehr}
      </div>
    )
  }
})
