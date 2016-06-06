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
    let mehr = ''

    const datenstand = (
      <div
        className={css(styles.line)}
      >
        <div className={css(styles.label)}>
          Stand:
        </div>
        <div className={css(styles.description)}>
          {pc.fields.Datenstand}
        </div>
      </div>
    )

    const nutzunbsbedingungen = (
      <div className={css(styles.line)}>
        <div className={css(styles.label)}>
          Nutzungsbedingungen:
        </div>
        <div className={css(styles.description)}>
          {pc.fields.Nutzungsbedingungen}
        </div>
      </div>
    )

    let link = ''
    if (pc.fields.Link) {
      link = (
        <div className={css(styles.line)}>
          <div className={css(styles.label)}>
            Link:
          </div>
          <div className={css(styles.description)}>
            <a
              href={pc.fields.Link}
              target="_blank"
            >
              {pc.fields.Link}
            </a>
          </div>
        </div>
      )
    }

    let importiertVon = ''
    if (pc.fields['importiert von']) {
      importiertVon = (
        <div className={css(styles.line)}>
          <div className={css(styles.label)}>
            Importiert von:
          </div>
          <div className={css(styles.description)}>
            <a
              href={`mailto:${pc.fields['importiert von']}`}
              target="_blank"
            >
              {pc.fields['importiert von']}
            </a>
          </div>
        </div>
      )
    }

    let ursprungsEs = ''
    if (pc.fields.Ursprungsdatensammlung) {
      ursprungsEs = (
        <div className={css(styles.line)}>
          <div className={css(styles.label)}>
            Zus.-fassend:
          </div>
          <div className={css(styles.description)}>
            Diese Eigenschaftensammlung fasst die Daten mehrerer
            Eigenschaftensammlungen in einer zusammen.<br />
            Die angezeigten Informationen stammen aus der
            Eigenschaftensammlung {`"${pc.fields.Ursprungsdatensammlung}"`}
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
            Bei den angezeigten Informationen ist die
            Ursprungs-Eigenschaftensammlung leider nicht beschrieben
          </div>
        </div>
      )
    }

    if (
      pc.fields.Datenstand ||
      pc.fields.Nutzungsbedingungen ||
      pc.fields.Link ||
      (pc.combining && pc.fields.Ursprungsdatensammlung)
    ) {
      mehr = (
        <span>
          <a
            href="#"
            onClick={this.onClick}
            className="showNextHidden"
          >
            {isVisible ? '...weniger' : '...mehr'}
          </a>
          <div
            style={{ display: isVisible ? 'block' : 'none' }}
          >
            {pc.fields.Datenstand && datenstand}
            {pc.fields.Nutzungsbedingungen && nutzunbsbedingungen}
            {pc.fields.Link && link}
            {pc.fields['importiert von'] && importiertVon}
            {pc.combining && ursprungsEs}
          </div>
        </span>
      )
    }

    return (
      <div
        className={css(styles.rootDiv)}
      >
        <span style={{ marginRight: 3 }}>
          {pc.fields.Beschreibung}
        </span>
        {mehr}
      </div>
    )
  }
})
