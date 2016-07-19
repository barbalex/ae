import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Home from './Home'
import * as userActions from '../actions/user'
import * as groupsActions from '../actions/groups'
import * as appActions from '../actions/app'
import * as errorActions from '../actions/errors'
import * as nodesActions from '../actions/nodes'

const actions = Object.assign(
  userActions,
  groupsActions,
  appActions,
  errorActions,
  nodesActions,
)

function mapStateToProps(state) {
  const { user } = state.user
  const { errors } = state.errors

  return {
    user,
    errors
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
