export default (node, nodes) =>
  node.data.path.map((id) =>
    nodes.find((nd) =>
      nd.id === id
    ).name
  )
