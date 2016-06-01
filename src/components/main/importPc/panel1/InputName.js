'use strict'

import React from 'react'
import { OverlayTrigger, Popover, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'
import labelWithPopover from '../../../../styles/labelWithPopover.js'

const styles = StyleSheet.create({
  label: labelWithPopover()
})

const popover = (
  <Popover
    id="inputNamePopover"
    title="So wählen Sie einen guten Namen:"
  >
    <p>
      Er sollte ungefähr dem ersten Teil eines Literaturzitats
      entsprechen. Beispiel: "Blaue Liste (1998)".
    </p>
    <p>
      Wurden die Informationen spezifisch für einen bestimmten
      Kanton oder die ganze Schweiz erarbeitet?<br />
      Wenn ja: Bitte das entsprechende Kürzel voranstellen.
      Beispiel: "ZH Artwert (aktuell)".
    </p>
  </Popover>
)

const InputName = ({
  name,
  validName,
  onChangeName,
  onBlurName
}) => (
  <FormGroup
    validationState={validName ? null : 'error'}
  >
    <OverlayTrigger
      trigger={['click', 'focus']}
      rootClose
      placement="right"
      overlay={popover}
    >
      <ControlLabel
        className={css(styles.label)}
      >
        Name
      </ControlLabel>
    </OverlayTrigger>
    <FormControl
      type="text"
      value={name}
      placeholder={validName ? '' : 'erforderlich'}
      onChange={(event) =>
        onChangeName(event.target.value)
      }
      onBlur={(event) =>
        onBlurName(event.target.value)
      }
    />
  </FormGroup>
)

InputName.displayName = 'InputName'

InputName.propTypes = {
  name: React.PropTypes.string,
  validName: React.PropTypes.bool,
  onChangeName: React.PropTypes.func,
  onBlurName: React.PropTypes.func
}

export default InputName
