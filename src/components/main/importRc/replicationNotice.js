'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ReplicationNotice',

  propTypes: {
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string
  },

  onClickReplicateToAe () {
    app.Actions.replicateToRemoteDb()
  },

  render() {
    const { replicatingToAe, replicatingToAeTime } = this.props
    let style = {
      marginTop: 8
    }
    let text = 'Nach arteigenschaften.ch replizieren'
    if (replicatingToAe === 'success') {
      style.color = '#00AA00'
      text = 'Zuletzt nach arteigenschaften.ch repliziert: ' + replicatingToAeTime
      return <p style={style}>{text}</p>
    }
    if (replicatingToAe === 'error') {
      style.color = 'red'
      text = 'Replikation nach arteigenschaften.ch gescheitert um: ' + replicatingToAeTime
      return <p style={style}>{text}</p>
    }
    return <Button onClick={this.onClickReplicateToAe} style={style}><Glyphicon glyph='cloud-upload'/> {text}</Button>
  }
})
