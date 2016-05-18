'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

const popover = (
  <Popover
    id="InputLinkPopover"
    title="Wozu ein Link?"
  >
    <p>Kann die Originalpublikation verlinkt werden?</p>
    <p>Oder eine erläuternde Webseite?</p>
  </Popover>
)

const InputLink = ({ link, validLink, onChangeLink, onBlurLink }) => (
  <div
    className={validLink ? 'form-group' : 'form-group has-error'}
  >
    <OverlayTrigger
      trigger={['click', 'focus']}
      rootClose
      placement="right"
      overlay={popover}
    >
      <label className="control-label withPopover">
        Link
      </label>
    </OverlayTrigger>
    <input
      type="textarea"
      className="form-control controls"
      value={link}
      onBlur={() => onBlurLink()}
      onChange={(event) => onChangeLink(event.target.value)}
      rows={1}
    />
    {
      validLink &&
      <div className="validateDiv feld">
        Bitte prüfen Sie den Link. Es muss einge gültige URL sein
      </div>
    }
  </div>
)

InputLink.displayName = 'InputLink'

InputLink.propTypes = {
  link: React.PropTypes.string,
  validLink: React.PropTypes.bool,
  onChangeLink: React.PropTypes.func,
  onBlurLink: React.PropTypes.func
}

export default InputLink
