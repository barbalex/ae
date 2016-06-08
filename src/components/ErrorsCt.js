import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Errors from './Errors'
import * as errorActions from '../actions/errors'

function mapStateToProps(state) {
  const { errors } = state.errors

  return { errors }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(errorActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Errors)
