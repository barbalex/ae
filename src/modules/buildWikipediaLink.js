'use strict'

export default (object) => {
  let link = '#'
  if (object && object.Taxonomien) {
    const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy.Standardtaxonomie)
    if (standardtaxonomie && standardtaxonomie.Eigenschaften) {
      const properties = standardtaxonomie.Eigenschaften
      link = '//de.wikipedia.org/wiki/'
      const { Artname, Art, Name, Gattung, Einheit } = properties

      switch (object.Gruppe) {
        case 'Flora':
          if (properties['Name Deutsch']) {
            link += properties['Name Deutsch']
          } else {
            link += Artname
          }
          break
        case 'Fauna':
        case 'Moose':
          link += Gattung + '_' + Art
          break
        case 'Macromycetes':
          link += Name
          break
        case 'Lebensräume':
          link += Einheit
          break
      }
    }
  }
  return link
}
