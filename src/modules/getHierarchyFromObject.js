import { has, get } from 'lodash'

export default (object) => {
  if (object.Taxonomien) {
    const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy.Standardtaxonomie)
    if (
      standardtaxonomie &&
      has(standardtaxonomie, 'Eigenschaften.Hierarchie') &&
      object.Gruppe
    ) {
      const hArray = get(standardtaxonomie, 'Eigenschaften.Hierarchie')
      // group name is not included in Hierarchie > add it
      const gruppenObjekt = { Name: object.Gruppe }
      hArray.unshift(gruppenObjekt)
      return hArray
    }
  }
  return null
}
