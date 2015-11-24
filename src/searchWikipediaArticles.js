'use strict'

export default (object) => {
  let wikipediaLink = '//de.wikipedia.org/wiki/'
  const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy.Standardtaxonomie)

  switch (object.Gruppe) {
    case 'Flora':
      if (standardtaxonomie.Eigenschaften['Name Deutsch']) {
        wikipediaLink += standardtaxonomie.Eigenschaften['Name Deutsch']
      } else {
        wikipediaLink += standardtaxonomie.Eigenschaften.Artname
      }
      break
    case 'Fauna':
      wikipediaLink += standardtaxonomie.Eigenschaften.Gattung + '_' + standardtaxonomie.Eigenschaften.Art
      break
    case 'Moose':
      wikipediaLink += standardtaxonomie.Eigenschaften.Gattung + '_' + standardtaxonomie.Eigenschaften.Art
      break
    case 'Macromycetes':
      wikipediaLink += standardtaxonomie.Eigenschaften.Name
      break
    case 'Lebensräume':
      wikipediaLink += standardtaxonomie.Eigenschaften.Einheit
      break
  }

  window.open(wikipediaLink)
}
