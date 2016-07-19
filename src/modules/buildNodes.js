const d3 = require('d3-hierarchy')

export default (nodesData) => {
  const root = d3.stratify()
    .id((n) => n.id)
    .parentId((n) => n.parent_id)(nodesData)
  return root
}
