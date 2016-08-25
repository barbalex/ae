import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Main from './Main'
import * as userActions from '../../actions/user'
import * as groupsActions from '../../actions/groups'
import * as appActions from '../../actions/app'
import * as errorActions from '../../actions/errors'
import * as nodesActions from '../../actions/nodes'

const actions = Object.assign(
  userActions,
  groupsActions,
  appActions,
  errorActions,
  nodesActions,
)

function mapStateToProps(state) {
  const {
    nodes,
    object,
  } = state.nodes

  return {
    nodes,
    object,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
