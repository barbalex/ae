import React from 'react'
import { OverlayTrigger, Popover, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'
import labelWithPopover from '../../../../styles/labelWithPopover.js'

const styles = StyleSheet.create({
  label: labelWithPopover()
})

const popover = () => (
  <Popover
    id="InputBeschreibungPopover"
    title="So beschreiben Sie die Sammlung:"
  >
    <p>
      Die Beschreibung sollte im ersten Teil etwa einem klassischen Literaturzitat entsprechen.<br />
      Beispiel: "Delarze R. & Gonseth Y. (2008): Lebensräume der Schweiz".
    </p>
    <p>
      In einem zweiten Teil sollte beschrieben werden, welche Informationen die Datensammlung enthält.<br />
      Beispiel: "Delarze R. & Gonseth Y. (2008): Lebensräume der Schweiz.
      791 Beziehungen zwischen 279 Lebensräumen und Tierarten".
    </p>
    <p>
      Es kann sehr nützlich sein, zu wissen, wozu die Informationen zusammengestellt wurden.
    </p>
  </Popover>
)

const InputBeschreibung = ({
  beschreibung,
  validBeschreibung,
  onChangeBeschreibung
}) =>
  <FormGroup
    validationState={validBeschreibung ? null : 'error'}
  >
    <OverlayTrigger
      trigger={['click', 'focus']}
      rootClose
      placement="right"
      overlay={popover()}
    >
      <ControlLabel
        className={css(styles.label)}
      >
        Beschreibung
      </ControlLabel>
    </OverlayTrigger>
    <FormControl
      componentClass="textarea"
      value={beschreibung}
      placeholder={validBeschreibung ? '' : 'erforderlich'}
      onChange={(event) =>
        onChangeBeschreibung(event.target.value)
      }
      rows={1}
    />
  </FormGroup>

InputBeschreibung.displayName = 'InputBeschreibung'

InputBeschreibung.propTypes = {
  beschreibung: React.PropTypes.string,
  validBeschreibung: React.PropTypes.bool,
  onChangeBeschreibung: React.PropTypes.func
}

export default InputBeschreibung
