import React from 'react'
import { OverlayTrigger, Popover, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'
import labelWithPopover from '../../../../styles/labelWithPopover.js'

const styles = StyleSheet.create({
  label: labelWithPopover()
})

const popover = (
  <Popover
    id="InputImportiertVonPopover"
  >
    <p>
      Das ist immer die Email des angemeldeten Benutzers
    </p>
  </Popover>
)

const InputImportiertVon = ({ importiertVon }) => (
  <FormGroup>
    <OverlayTrigger
      trigger={['click', 'focus']}
      rootClose
      placement="right"
      overlay={popover}
    >
      <ControlLabel
        className={css(styles.label)}
      >
        importiert von
      </ControlLabel>
    </OverlayTrigger>
    <FormControl
      type="text"
      value={importiertVon}
      disabled
    />
  </FormGroup>
)

InputImportiertVon.displayName = 'InputImportiertVon'

InputImportiertVon.propTypes = {
  importiertVon: React.PropTypes.string
}

export default InputImportiertVon
