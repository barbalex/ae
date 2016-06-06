'use strict'

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

const TcsQuerying = () =>
  <OverlayTrigger
    placement="left"
    overlay={
      <Tooltip
        id="tcsQueryingTooltip"
        bsStyle="info"
      >
        Bitte Geduld: Die App kann zeitweise einfrieren!
      </Tooltip>
    }
  >
    <p
      className={css(styles.text)}
    >
      Lade aktuelle Taxonomiensammlungen...
    </p>
  </OverlayTrigger>

TcsQuerying.displayName = 'TcsQuerying'

export default TcsQuerying
