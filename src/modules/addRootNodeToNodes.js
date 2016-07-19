/**
 * for d3-hierarchy's stratify to work on all nodes
 * there needs to be a single root node
 */

export default (nodesData) => {
  const nodesList = nodesData
  nodesList.forEach((n) => {
    if (n.parent_id === null) {
      n.parent_id = 'root'
    }
  })
  nodesList.unshift({
    id: 'root',
    parent_id: null,
    name: 'root',
  })
  return nodesList
}
