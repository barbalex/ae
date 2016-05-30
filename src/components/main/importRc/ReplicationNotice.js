'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'

const ReplicationNotice = ({ replicatingToAe, replicatingToAeTime }) => {
  let style = {
    marginTop: 8
  }
  let text = 'Nach arteigenschaften.ch replizieren'
  if (replicatingToAe === 'success') {
    style.color = '#00AA00'
    text = `Zuletzt nach arteigenschaften.ch repliziert: ${replicatingToAeTime}`
    return <p style={style}>{text}</p>
  }
  if (replicatingToAe === 'error') {
    style.color = 'red'
    text = `Replikation nach arteigenschaften.ch gescheitert um: ${replicatingToAeTime}`
    return <p style={style}>{text}</p>
  }
  return (
    <Button
      onClick={() =>
        app.Actions.replicateToRemoteDb()
      }
      style={style}
    >
      <Glyphicon glyph="cloud-upload" />
      &nbsp;
      {text}
    </Button>
  )
}

ReplicationNotice.displayName = 'ReplicationNotice'

ReplicationNotice.propTypes = {
  replicatingToAe: React.PropTypes.string,
  replicatingToAeTime: React.PropTypes.string
}

export default ReplicationNotice
