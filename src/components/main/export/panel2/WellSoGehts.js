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
            Nachfolgend sind alle Eigenschaften aufgelistet,
            die in den gewählten Gruppen vorkommen
          </li>
          <li>
            Erfassen Sie in den Eigenschaften Ihrer Wahl
            die gewünschten Filter-Kriterien...
          </li>
          <li>
            ...und wählen Sie danach unter "3. Eigenschaften wählen",
            welche Eigenschaften exportiert werden sollen
          </li>
        </ul>
      </Well>
    )
  }
})
