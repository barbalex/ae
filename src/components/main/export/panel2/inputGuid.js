'use strict'

import React from 'react'
import { OverlayTrigger, Popover, Alert } from 'react-bootstrap'
import isGuid from '../../../../modules/isGuid.js'

export default React.createClass({
  displayName: 'InputGuid',

  propTypes: {
    onChangeFilterField: React.PropTypes.func,
    invalidGuids: React.PropTypes.array
  },

  getInitialState() {
    return {
      invalidGuids: []
    }
  },

  onBlur(cName, fName, event) {
    const { onChangeFilterField } = this.props
    const invalidGuids = []
    let value = event.target.value
    // one or more guids were entered
    if (value) {
      // remove empty strings from value
      value = value.replace(/\s+/g, '')
      if (value) {
        // convert value into array
        // this way user can enter a single guid or many comma separated
        value = value.split(',')
        // check if values are valid guids
        value.forEach((val, index) => {
          if (val === null || val === '') {
            value.splice(index, 1)
          } else if (!isGuid(val)) {
            invalidGuids.push(val)
          }
        })
      } else {
        value = null
      }
    } else {
      value = null
    }
    this.setState({ invalidGuids })
    // build a event object that passes the array as an array - event.target.value passes it as string
    const eventToPass = {
      target: { value }
    }
    if (invalidGuids.length === 0) {
      onChangeFilterField(cName, fName, 'object', eventToPass)
    }
  },

  popover() {
    return (
      <Popover
        id="inputFilterGuidPopover"
      >
        <p>
          Sie können hier einen einzelnen GUID einsetzen, z.B.:<br />
          <em>
            c9cfe3e0-e298-7a36-9c88-7c2acf143bab
          </em>
        </p>
        <p>
          Oder eine Liste von GUID`s, die Sie mit einem Komma und
          (fakultativ) einem Leerschlag trennen, z.B.:<br />
          <em>
            c9cfe3e0-e298-7a36-9c88-7c2acf143bab<strong>,&nbsp;
            </strong>001FCF2F-9833-4B52-9201-B4B04C9A05BA<strong>,&nbsp;
            </strong>004A12F2-C881-4CA4-8C7E-F4444A8F08F0
          </em>
        </p>
      </Popover>
    )
  },

  invalidGuids() {
    const { invalidGuids } = this.state
    const alertStyle = {
      marginTop: 8
    }
    const list = invalidGuids.map((guid, index) =>
      <li key={index}>{guid}</li>
    )
    return (
      <Alert
        bsStyle="danger"
        className="controls feld"
        style={alertStyle}
      >
        <p>Bitte prüfen Sie die folgenden GUID`s:</p>
        <ul>
          {list}
        </ul>
      </Alert>
    )
  },

  render() {
    const { invalidGuids } = this.state
    const showInvalidGuids = invalidGuids.length > 0
    // necessary to align guid with other fields
    const divStyle = {
      marginLeft: 0
    }
    const formGroupClass = (
      invalidGuids.length > 0 ?
      'form-group has-error' :
      'form-group'
    )
    return (
      <div>
        <div
          className={formGroupClass}
          style={divStyle}
        >
          <OverlayTrigger
            trigger={['click', 'focus']}
            rootClose
            placement="right"
            overlay={this.popover()}
          >
            <label
              className="control-label withPopover"
            >
              GUID
            </label>
          </OverlayTrigger>
          <textarea
            className="controls input-sm form-control"
            onBlur={this.onBlur.bind(this, 'object', '_id')}
            spellCheck={false}
          />
          {showInvalidGuids ? this.invalidGuids() : null}
        </div>
      </div>
    )
  }
})
