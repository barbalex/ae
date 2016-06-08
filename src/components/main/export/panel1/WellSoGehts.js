import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellSoGehtsGruppeWaehlen',

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
        <b>So geht`s</b>
        &nbsp;
        <a
          href="#"
          onClick={this.onClickToggle}
          className="showNextHidden"
        >
          {visible ? '...weniger' : '...mehr'}
        </a>
        <ul
          style={{ display: visible ? 'block' : 'none' }}
        >
          <li>
            Wählen Sie eine oder mehrere Gruppen...
          </li>
          <li>
            ...dann werden ihre Eigenschaften aufgebaut...
          </li>
          <li>
            ...und Sie können filtern und Eigenschaften wählen
          </li>
          <li>
            <a
              href="//youtu.be/J13wS88pYC8"
              target="_blank"
            >
              Auf YouTube sehen
            </a>
          </li>
        </ul>
      </Well>
    )
  }
})
