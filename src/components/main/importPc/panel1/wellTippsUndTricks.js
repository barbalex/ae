'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellTippsTricks',

  propTypes: {
    visible: React.PropTypes.bool
  },

  getInitialState() {
    return {
      visible: false
    }
  },

  onClickToggle(event) {
    event.preventDefault()
    this.setState({ visible: !this.state.visible })
  },

  render() {
    const { visible } = this.state

    return (
      <Well bsSize="small">
        <strong>Tipps und Tricks</strong>
        &nbsp;
        <a
          href="#"
          onClick={this.onClickToggle}
          className="showNextHidden"
        >
          {visible ? '...weniger' : '...mehr'}
        </a>
        <ul
          className="adb-hidden"
          style={{ display: visible ? 'block' : 'none' }}
        >
          <li>
            Klicken Sie auf unterstrichene Feldnamen, um zu erfahren,
            wie das jeweilige Feld beschrieben werden sollte.
          </li>
          <li>
            <a
              href="//youtu.be/nqd-v6YxkOY"
              target="_blank"
            >
              <b>Auf Youtube sehen, wie es geht</b>
            </a>
          </li>
        </ul>
      </Well>
    )
  }
})
