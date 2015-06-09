'use strict'

export default function (object) {
  let wikipediaLink = '//de.wikipedia.org/wiki/'

  switch (object.Gruppe) {
    case 'Flora':
      if (object.Taxonomie.Eigenschaften['Name Deutsch']) {
        wikipediaLink += object.Taxonomie.Eigenschaften['Name Deutsch']
      } else {
        wikipediaLink += object.Taxonomie.Eigenschaften.Artname
      }
      break
    case 'Fauna':
      wikipediaLink += object.Taxonomie.Eigenschaften.Gattung + '_' + object.Taxonomie.Eigenschaften.Art
      break
    case 'Moose':
      wikipediaLink += object.Taxonomie.Eigenschaften.Gattung + '_' + object.Taxonomie.Eigenschaften.Art
      break
    case 'Macromycetes':
      wikipediaLink += object.Taxonomie.Eigenschaften.Name
      break
    case 'Lebensräume':
      wikipediaLink += object.Taxonomie.Eigenschaften.Einheit
      break
  }

  window.open(wikipediaLink)
}
