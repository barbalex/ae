'use strict'

export default function (object) {
  if (object && object.Taxonomie && object.Taxonomie.Eigenschaften) {
    const properties = object.Taxonomie.Eigenschaften
    let link = ''

    switch (object.Gruppe) {
      case 'Flora':
        link = 'https://www.google.ch/search?num=10&hl=de&site=imghp&tbm=isch&source=hp&bih=824&q="' + properties.Artname + '"'
        if (properties['Name Deutsch']) {
          link += '+OR+"' + properties['Name Deutsch'] + '"'
        }
        if (properties['Name Französisch']) {
          link += '+OR+"' + properties['Name Französisch'] + '"'
        }
        if (properties['Name Italienisch']) {
          link += '+OR+"' + properties['Name Italienisch'] + '"'
        }
        break
      case 'Fauna':
        link = 'https://www.google.ch/search?num=10&hl=de&site=imghp&tbm=isch&source=hp&bih=824&q="' + properties.Artname + '"'
        if (properties['Name Deutsch']) {
          link += '+OR+"' + properties['Name Deutsch'] + '"'
        }
        if (properties['Name Französisch']) {
          link += '+OR+"' + properties['Name Französisch'] + '"'
        }
        if (properties['Name Italienisch']) {
          link += '+OR"' + properties['Name Italienisch'] + '"'
        }
        break
      case 'Moose':
        link = 'https://www.google.ch/search?num=10&hl=de&site=imghp&tbm=isch&source=hp&bih=824&q="' + properties.Gattung + ' ' + properties.Art + '"'
        break
      case 'Macromycetes':
        link = 'https://www.google.ch/search?num=10&hl=de&site=imghp&tbm=isch&source=hp&bih=824&q="' + properties.Name + '"'
        if (properties['Name Deutsch']) {
          link += '+OR+"' + properties['Name Deutsch'] + '"'
        }
        break
      case 'Lebensräume':
        link = 'https://www.google.ch/search?num=10&hl=de&site=imghp&tbm=isch&source=hp&bih=824&q="' + properties.Einheit
        break
    }
    return link
  } else {
    return '#'
  }
}
