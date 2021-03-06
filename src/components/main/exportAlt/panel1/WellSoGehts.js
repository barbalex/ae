
import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellSoGehts',

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
      <Well
        bsSize="small"
        style={{ marginBottom: 5 }}
      >
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
            Nachfolgend sind alle Eigenschaften aufgelistet,<br />
            die in den vom Artenlistentool auswertbaren Gruppen (Flora und Fauna) vorkommen
          </li>
          <li>
            Markieren Sie die Eigenschaften, die Sie exportieren möchten...
          </li>
          <li>
            ...und fahren Sie danach mit "2. URL generieren" weiter
          </li>
        </ul>
      </Well>
    )
  }
})
