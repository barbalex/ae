'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Alert, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'AlertLoadAllGroups',

  propTypes: {
    show: React.PropTypes.bool,
    groupsLoadingObjects: React.PropTypes.array,
    alertAllGroupsBsStyle: React.PropTypes.string
  },

  getInitialState () {
    return { show: true }
  },

  onDismiss () {
    this.setState({ show: false })
  },

  onClickreplicate () {
    app.Actions.loadPouchFromRemote()
    this.onDismiss()
  },

  render () {
    const { show } = this.state
    const { groupsLoadingObjects, alertAllGroupsBsStyle } = this.props
    const btnText = groupsLoadingObjects.length > 0 ? 'Lade Gruppen...' : 'Fehlende Gruppen laden'

    if (show) {
      return (
        <Alert
          id='allGroupsAlert'
          bsStyle={alertAllGroupsBsStyle}>
          <p>
            Um Daten zu importieren, müssen alle Gruppen geladen sein
          </p>
          <Button
            onClick={this.onClickreplicate}>
            {btnText}
          </Button>
        </Alert>
      )
    }
    return null
  }
})
