'use strict'

import React from 'react'
import { ProgressBar } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  p: {
    paddingLeft: 4,
    marginTop: 2,
    marginBottom: 1
  }
})

const LoadingMessage = ({ groupLoadingObject }) => {
  let { message, progressPercent } = groupLoadingObject
  // Macromycetes shall appear as Pilze
  message = message.replace('Macromycetes', 'Pilze')

  if (progressPercent || progressPercent === 0) {
    return (
      <ProgressBar
        bsStyle="success"
        now={progressPercent}
        label={message}
      />
    )
  }
  return <p className={css(styles.p)}>{message}</p>
}

LoadingMessage.displayName = 'LoadingMessage'

LoadingMessage.propTypes = {
  groupLoadingObject: React.PropTypes.object
}

export default LoadingMessage
