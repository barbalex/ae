'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Home from '../components/Home'
import * as userActions from '../actions/user'
import * as groupsActions from '../actions/groups'
import * as appActions from '../actions/app'

const actions = Object.assign(
  userActions,
  groupsActions,
  appActions
)

function mapStateToProps(state) {
  const { user } = state.user

  return {
    user
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
