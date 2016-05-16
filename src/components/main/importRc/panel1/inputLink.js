'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputLink',

  propTypes: {
    link: React.PropTypes.string,
    validLink: React.PropTypes.bool,
    onChangeLink: React.PropTypes.func,
    onBlurLink: React.PropTypes.func
  },

  onChange (event) {
    const link = event.target.value
    this.props.onChangeLink(link)
  },

  onBlur() {
    this.props.onBlurLink()
  },

  popover() {
    return (
      <Popover id='InputLinkPopiver' title='Wozu ein Link?'>
        <p>Kann die Originalpublikation verlinkt werden?</p>
        <p>Oder eine erläuternde Webseite?</p>
      </Popover>
    )
  },

  render() {
    const { link, validLink } = this.props

    return (
      <div className={validLink ? 'form-group' : 'form-group has-error'}>
        <OverlayTrigger trigger={['click', 'focus']} rootClose placement='right' overlay={this.popover()}>
          <label className='control-label withPopover'>Link</label>
        </OverlayTrigger>
        <input type='textarea' className='form-control controls' value={link} onBlur={this.onBlur} onChange={this.onChange} rows={1} />
        {validLink ? null : <div className='validateDiv feld'>Bitte prüfen Sie den Link. Es muss einge gültige URL sein</div>}
      </div>
    )
  }
})
