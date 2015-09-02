'use strict'

export default (object) => {
  if (object && object.Taxonomie && object.Taxonomie.Eigenschaften) {
    const properties = object.Taxonomie.Eigenschaften
    let link = ''

    switch (object.Gruppe) {
    case 'Flora':
      if (properties['Name Deutsch']) {
        link = '//de.wikipedia.org/wiki/' + properties['Name Deutsch']
      } else {
        link = '//de.wikipedia.org/wiki/' + properties.Artname
      }
      break
    case 'Fauna':
      link = '//de.wikipedia.org/wiki/' + properties.Gattung + '_' + properties.Art
      break
    case 'Moose':
      link = '//de.wikipedia.org/wiki/' + properties.Gattung + '_' + properties.Art
      break
    case 'Macromycetes':
      link = '//de.wikipedia.org/wiki/' + properties.Name
      break
    case 'Lebensräume':
      link = '//de.wikipedia.org/wiki/' + properties.Einheit
      break
    }
    return link
  } else {
    return '#'
  }
}
