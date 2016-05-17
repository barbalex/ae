'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

const inputZusammenfassendPopover = (
  <Popover
    id="InputZusammenfassendPopover"
    title='Was heisst "zusammenfassend"?'
  >
    <p>
      Die Informationen in einer zusammenfassenden Beziehungssammlung wurden aus
      mehreren eigenständigen Beziehungssammlungen zusammegefasst.
    </p>
    <p>
      Zweck: Jede Art bzw. jeder Lebensraum enthält die jeweils aktuellste Information zum Thema.
    </p>
    <p>
      Beispiel: Rote Liste.
    </p>
    <p>
      Mehr Infos&nbsp;
      <a
        href="https://github.com/FNSKtZH/artendb/blob/master/README.md#zusammenfassende-eigenschaftensammlungen"
        target="_blank"
      >
        im Projektbeschrieb
      </a>.
    </p>
  </Popover>
)

const InputZusammenfassend = ({ zusammenfassend, onChangeZusammenfassend }) => (
  <div className="form-group">
    <OverlayTrigger
      trigger={['click', 'focus']}
      rootClose
      placement="right"
      overlay={inputZusammenfassendPopover}
    >
      <label
        className="control-label withPopover"
        htmlFor="dsZusammenfassend"
      >
        zusammenfassend
      </label>
    </OverlayTrigger>
    <input
      type="checkbox"
      label="zusammenfassend"
      checked={zusammenfassend}
      onChange={(event) => onChangeZusammenfassend(event.target.checked)}
    />
  </div>
)

InputZusammenfassend.displayName = 'InputZusammenfassend'

InputZusammenfassend.propTypes = {
  zusammenfassend: React.PropTypes.bool,
  onChangeZusammenfassend: React.PropTypes.func
}

export default InputZusammenfassend
