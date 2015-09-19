'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputFilterGuid',

  propTypes: {
    onChangeFilterField: React.PropTypes.func
  },

  onBlur (cName, fName, event) {
    const { onChangeFilterField } = this.props
    onChangeFilterField(cName, fName, event)
  },

  popover () {
    return (
      <Popover id='inputFilterGuidPopover'>
        <p>
          Sie können hier einen einzelnen GUID einsetzen, z.B.:<br/>
          <em>
            c9cfe3e0-e298-7a36-9c88-7c2acf143bab
          </em>
        </p>
        <p>
          Oder eine Liste von GUID`s, die Sie mit einem Komma und (fakultativ) einem Leerschlag trennen, z.B.:<br/>
          <em>
            c9cfe3e0-e298-7a36-9c88-7c2acf143bab<strong>, </strong>001FCF2F-9833-4B52-9201-B4B04C9A05BA<strong>, </strong>004A12F2-C881-4CA4-8C7E-F4444A8F08F0
          </em>
        </p>
      </Popover>
    )
  },

  render () {
    // necessary to align guid with other fields
    const divStyle = {
      marginLeft: 0
    }
    return (
      <div className='form-group' style={divStyle}>
        <OverlayTrigger trigger={['click', 'focus']} rootClose placement='right' overlay={this.popover()}>
          <label className='control-label withPopover'>GUID</label>
        </OverlayTrigger>
        <input type='textarea' className='controls input-sm form-control' onBlur={this.onBlur.bind(this, 'object', '_id')} />
      </div>
    )
  }
})
