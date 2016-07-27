import { has, map } from 'lodash'

export default (object) => {
  if (object.Taxonomien) {
    const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy.Standardtaxonomie)
    if (
      standardtaxonomie &&
      has(standardtaxonomie, 'Eigenschaften.Hierarchie')
    ) {
      const path = map(standardtaxonomie.Eigenschaften.Hierarchie, 'Name')
      /**
       * I have no idea when Gruppe is included in path
       * if I add it it is usually doubly included
       * if I dont add it it usually isnt there
       * so only add it if not already included
       */
      if (path[0] !== object.Gruppe) path.unshift(object.Gruppe)
      return path
    }
  }
  return []
}
