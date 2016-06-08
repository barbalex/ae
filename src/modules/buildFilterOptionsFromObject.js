export default (object) => {
  let options = null
  const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy.Standardtaxonomie)
  if (standardtaxonomie && standardtaxonomie.Eigenschaften) {
    const eig = standardtaxonomie.Eigenschaften
    if (eig['Artname vollständig']) {
      // this is a species object
      options = {
        value: object._id,
        label: eig['Artname vollständig']
      }
    }
    if (eig.Einheit) {
      // this is an lr object
      // top level has no label
      options = {
        value: object._id,
        label: eig.Label ? `${eig.Label}: ${eig.Einheit}` : eig.Einheit
      }
    }
  }
  return options
}
