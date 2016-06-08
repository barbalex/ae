import React from 'react'
import { OverlayTrigger, Popover, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'
import labelWithPopover from '../../../../styles/labelWithPopover.js'
import validateDiv from '../../../../styles/validateDiv.js'

const styles = StyleSheet.create({
  label: labelWithPopover(),
  validateDiv: validateDiv()
})

const popover = () => (
  <Popover
    id="InputLinkPopiver"
    title="Wozu ein Link?"
  >
    <p>
      Kann die Originalpublikation verlinkt werden?
    </p>
    <p>
      Oder eine erläuternde Webseite?
    </p>
  </Popover>
)

const InputLink = ({
  link,
  validLink,
  onBlurLink,
  onChangeLink
}) =>
  <div>
    <FormGroup
      validationState={validLink ? null : 'error'}
    >
      <OverlayTrigger
        trigger={['click', 'focus']}
        rootClose
        placement="right"
        overlay={popover()}
      >
        <ControlLabel className={css(styles.label)}>
          Link
        </ControlLabel>
      </OverlayTrigger>
      <FormControl
        componentClass="textarea"
        value={link}
        onBlur={() => onBlurLink()}
        onChange={(event) =>
          onChangeLink(event.target.value)
        }
        rows={1}
      />
    </FormGroup>
    {
      !validLink &&
      <FormGroup>
        <ControlLabel style={{ display: 'block' }} />
        <div style={{ width: '100%' }} className={css(styles.validateDiv)}>
          Bitte prüfen Sie den Link. Es muss einge gültige URL sein
        </div>
      </FormGroup>
    }
  </div>

InputLink.displayName = 'InputLink'

InputLink.propTypes = {
  link: React.PropTypes.string,
  validLink: React.PropTypes.bool,
  onChangeLink: React.PropTypes.func,
  onBlurLink: React.PropTypes.func
}

export default InputLink
