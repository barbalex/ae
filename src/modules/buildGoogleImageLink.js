'use strict'

export default (object) => {
  if (object && object.Taxonomie && object.Taxonomie.Eigenschaften) {
    const properties = object.Taxonomie.Eigenschaften
    const { Artname, Gattung, Art, Name, Einheit } = properties
    let link = 'https://www.google.ch/search?tbm=isch&q='

    switch (object.Gruppe) {
      case 'Flora':
        link += `"${Artname}"`
        if (properties['Name Deutsch']) link += ` OR "${properties['Name Deutsch']}"`
        if (properties['Name Französisch']) link += ` OR "${properties['Name Französisch']}"`
        if (properties['Name Italienisch']) link += ` OR "${properties['Name Italienisch']}"`
        break
      case 'Fauna':
        link += `"${Artname}"`
        if (properties['Name Deutsch']) link += ` OR "${properties['Name Deutsch']}"`
        if (properties['Name Französisch']) link += ` OR "${properties['Name Französisch']}"`
        if (properties['Name Italienisch']) link += ` OR "${properties['Name Italienisch']}"`
        break
      case 'Moose':
        link += `"${Gattung} ${Art}"`
        break
      case 'Macromycetes':
        link += `"${Name}"`
        if (properties['Name Deutsch']) link += ` OR "${properties['Name Deutsch']}"`
        break
      case 'Lebensräume':
        link += `"${Einheit}"`
        break
    }
    return link
  }
  return '#'
}
