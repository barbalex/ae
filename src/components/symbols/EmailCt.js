import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Email from './Email'
import * as userActions from '../../actions/user'

function mapStateToProps(state) {
  const { user } = state.user
  const { errors } = state.errors

  return {
    user,
    errors
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(userActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Email)
