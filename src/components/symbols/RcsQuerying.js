import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  text: {
    textDecoration: 'underline',
    paddingLeft: 5,
    color: 'red',
    fontWeight: 500,
    cursor: 'progress'
  }
})

const RcsQuerying = () =>
  <OverlayTrigger
    placement="left"
    overlay={
      <Tooltip
        id="rcsQueryingTooltip"
        bsStyle="info"
      >
        Bitte Geduld: Die App kann zeitweise einfrieren!
      </Tooltip>
    }
  >
    <p
      className={css(styles.text)}
    >
      Lade aktuelle Beziehungssammlungen...
    </p>
  </OverlayTrigger>

RcsQuerying.displayName = 'RcsQuerying'

export default RcsQuerying
