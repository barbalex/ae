'use strict'

export default function (object) {
  let wikipediaLink = ''

  switch (object.Gruppe) {
    case 'Flora':
      if (object.Taxonomie.Eigenschaften['Name Deutsch']) {
        wikipediaLink = '//de.wikipedia.org/wiki/' + object.Taxonomie.Eigenschaften['Name Deutsch']
      } else {
        wikipediaLink = '//de.wikipedia.org/wiki/' + object.Taxonomie.Eigenschaften.Artname
      }
      break
    case 'Fauna':
      wikipediaLink = '//de.wikipedia.org/wiki/' + object.Taxonomie.Eigenschaften.Gattung + '_' + object.Taxonomie.Eigenschaften.Art
      break
    case 'Moose':
      wikipediaLink = '//de.wikipedia.org/wiki/' + object.Taxonomie.Eigenschaften.Gattung + '_' + object.Taxonomie.Eigenschaften.Art
      break
    case 'Macromycetes':
      wikipediaLink = '//de.wikipedia.org/wiki/' + object.Taxonomie.Eigenschaften.Name
      break
    case 'Lebensräume':
      wikipediaLink = '//de.wikipedia.org/wiki/' + object.Taxonomie.Eigenschaften.Einheit
      break
  }

  window.open(wikipediaLink)
}
