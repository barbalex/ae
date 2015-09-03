'use strict'

export default (object) => {
  if (object && object.Taxonomie && object.Taxonomie.Eigenschaften) {
    const properties = object.Taxonomie.Eigenschaften
    let link = '//de.wikipedia.org/wiki/'
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
    return link
  } else {
    return '#'
  }
}
