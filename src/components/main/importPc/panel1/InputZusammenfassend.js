'use strict'

import React from 'react'
import { OverlayTrigger, Popover, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'
import labelWithPopover from '../../../../styles/labelWithPopover.js'

const styles = StyleSheet.create({
  label: labelWithPopover()
})

const popover = () => (
  <Popover
    id="InputZusammenfassendPopover"
    title='Was heisst "zusammenfassend"?'
  >
    <p>
      Die Informationen in einer zusammenfassenden Eigenschaftensammlung wurden aus
      mehreren eigenständigen Eigenschaftensammlungen zusammegefasst.
    </p>
    <p>
      Zweck: Jede Art bzw. jeder Lebensraum enthält die jeweils aktuellste Information zum Thema.
    </p>
    <p>
      Beispiel: Rote Liste.
    </p>
    <p>
      Mehr Infos
      &nbsp;
      <a
        href="https://github.com/FNSKtZH/artendb/blob/master/README.md#zusammenfassende-eigenschaftensammlungen"
        target="_blank"
      >
        im Projektbeschrieb
      </a>
      .
    </p>
  </Popover>
)

const InputZusammenfassend = ({ zusammenfassend, onChangeZusammenfassend }) =>
  <FormGroup>
    <OverlayTrigger
      trigger={['click', 'focus']}
      rootClose
      placement="right"
      overlay={popover()}
    >
      <ControlLabel
        className={css(styles.label)}
      >
        zusammenfassend
      </ControlLabel>
    </OverlayTrigger>
    <input
      type="checkbox"
      label="zusammenfassend"
      checked={zusammenfassend}
      style={{ marginTop: 8 }}
      onChange={(event) =>
        onChangeZusammenfassend(event.target.checked)
      }
    />
  </FormGroup>

InputZusammenfassend.displayName = 'InputZusammenfassend'

InputZusammenfassend.propTypes = {
  zusammenfassend: React.PropTypes.bool,
  onChangeZusammenfassend: React.PropTypes.func
}

export default InputZusammenfassend
