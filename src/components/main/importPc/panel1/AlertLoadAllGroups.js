import app from 'ampersand-app'
import React from 'react'
import { Alert, Button } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  alert: {
    marginBottom: 10,
  },
  button: {
    marginTop: 5,
  },
  p: {
    display: 'inline-block',
    marginTop: 5,
    marginRight: 10,
  }
})

export default React.createClass({
  displayName: 'AlertLoadAllGroups',

  propTypes: {
    show: React.PropTypes.bool,
    groupsLoadingObjects: React.PropTypes.array,
    alertAllGroupsBsStyle: React.PropTypes.string
  },

  getInitialState() {
    return { show: true }
  },

  onDismiss() {
    this.setState({ show: false })
  },

  onClickreplicate() {
    app.Actions.loadPouchFromRemote()
    this.onDismiss()
  },

  render() {
    const { show } = this.state
    const { groupsLoadingObjects, alertAllGroupsBsStyle } = this.props
    const btnText = (
      groupsLoadingObjects.length > 0 ?
      'Lade Gruppen...' :
      'Fehlende Gruppen laden'
    )

    if (show) {
      return (
        <Alert
          className={css(styles.alert)}
          bsStyle={alertAllGroupsBsStyle}
        >
          <p className={css(styles.p)}>
            Um Daten zu importieren, müssen alle Gruppen geladen sein
          </p>
          <Button
            onClick={this.onClickreplicate}
            className={css(styles.button)}
          >
            {btnText}
          </Button>
        </Alert>
      )
    }
    return null
  }
})
