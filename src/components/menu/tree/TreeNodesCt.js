import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TreeNodes from './TreeNodes'
import * as nodesActions from '../../../actions/nodes'

const actions = Object.assign(
  nodesActions,
)

function mapStateToProps(state, props) {
  const {
    object,
    idPath,
  } = state.nodes
  const { nodes } = props

  return {
    nodes,
    object,
    idPath,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TreeNodes)
