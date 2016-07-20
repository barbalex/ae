import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Tree from './Tree'
import * as nodesActions from '../../../actions/nodes'

const actions = Object.assign(
  nodesActions,
)

function mapStateToProps(state) {
  const {
    fetchingNodes,
    nodes,
    error,
  } = state.nodes
  const {
    path
  } = state.path

  return {
    fetchingNodes,
    nodes,
    error,
    path,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Tree)
