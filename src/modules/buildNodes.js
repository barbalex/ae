import d3 from 'd3-hierarchy'

export default (nodesData) => {
  const nodesList = nodesData
  nodesList.unshift({
    id: 'root',
    parent_id: null,
    name: 'root',
  })
  const root = d3.stratify()
    .id((n) => n.id)
    .parentId((n) => n.parent_id)(nodesList)
  console.log('buildNodes.js, root:', root)
  return root
}
