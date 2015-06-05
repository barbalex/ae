'use strict'

export default function (object) {
  let googleBilderLink = ''

  switch (object.Gruppe) {
    case 'Flora':
      googleBilderLink = 'https://www.google.ch/search?num=10&hl=de&site=imghp&tbm=isch&source=hp&bih=824&q="' + object.Taxonomie.Eigenschaften.Artname + '"'
      if (object.Taxonomie.Eigenschaften['Name Deutsch']) {
        googleBilderLink += '+OR+"' + object.Taxonomie.Eigenschaften['Name Deutsch'] + '"'
      }
      if (object.Taxonomie.Eigenschaften['Name Französisch']) {
        googleBilderLink += '+OR+"' + object.Taxonomie.Eigenschaften['Name Französisch'] + '"'
      }
      if (object.Taxonomie.Eigenschaften['Name Italienisch']) {
        googleBilderLink += '+OR+"' + object.Taxonomie.Eigenschaften['Name Italienisch'] + '"'
      }
      break
    case 'Fauna':
      googleBilderLink = 'https://www.google.ch/search?num=10&hl=de&site=imghp&tbm=isch&source=hp&bih=824&q="' + object.Taxonomie.Eigenschaften.Artname + '"'
      if (object.Taxonomie.Eigenschaften['Name Deutsch']) {
        googleBilderLink += '+OR+"' + object.Taxonomie.Eigenschaften['Name Deutsch'] + '"'
      }
      if (object.Taxonomie.Eigenschaften['Name Französisch']) {
        googleBilderLink += '+OR+"' + object.Taxonomie.Eigenschaften['Name Französisch'] + '"'
      }
      if (object.Taxonomie.Eigenschaften['Name Italienisch']) {
        googleBilderLink += '+OR"' + object.Taxonomie.Eigenschaften['Name Italienisch'] + '"'
      }
      break
    case 'Moose':
      googleBilderLink = 'https://www.google.ch/search?num=10&hl=de&site=imghp&tbm=isch&source=hp&bih=824&q="' + object.Taxonomie.Eigenschaften.Gattung + ' ' + object.Taxonomie.Eigenschaften.Art + '"'
      break
    case 'Macromycetes':
      googleBilderLink = 'https://www.google.ch/search?num=10&hl=de&site=imghp&tbm=isch&source=hp&bih=824&q="' + object.Taxonomie.Eigenschaften.Name + '"'
      if (object.Taxonomie.Eigenschaften['Name Deutsch']) {
        googleBilderLink += '+OR+"' + object.Taxonomie.Eigenschaften['Name Deutsch'] + '"'
      }
      break
    case 'Lebensräume':
      googleBilderLink = 'https://www.google.ch/search?num=10&hl=de&site=imghp&tbm=isch&source=hp&bih=824&q="' + object.Taxonomie.Eigenschaften.Einheit
      break
  }

  window.open(googleBilderLink)
}