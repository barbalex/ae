const d3 = require('d3-hierarchy')
import addRootNodeToNodes from './addRootNodeToNodes'

export default (nodesData) => {
  const nodesList = addRootNodeToNodes(nodesData)
  const root = d3.stratify()
    .id((n) => n.id)
    .parentId((n) => n.parent_id)(nodesList)
  return root
}
