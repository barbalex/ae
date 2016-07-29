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
    idPath,
    error,
  } = state.nodes

  return {
    fetchingNodes,
    nodes,
    error,
    idPath,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Tree)
