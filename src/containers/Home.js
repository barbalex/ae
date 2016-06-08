import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Home from '../components/Home'
import * as userActions from '../actions/user'
import * as groupsActions from '../actions/groups'
import * as appActions from '../actions/app'
import * as errorActions from '../actions/errors'

const actions = Object.assign(
  userActions,
  groupsActions,
  appActions,
  errorActions
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
