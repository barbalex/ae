'use strict'

export default (object) => {
  let googleBilderLink = 'https://www.google.ch/search?num=10&hl=de&site=imghp&tbm=isch&source=hp&bih=824&q="'
  const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy.Standardtaxonomie)
  const tax = standardtaxonomie.Eigenschaften || {}

  switch (object.Gruppe) {
    case 'Flora':
      googleBilderLink += tax.Artname + '"'
      if (tax['Name Deutsch']) {
        googleBilderLink += `+OR+" + ${tax['Name Deutsch']} + "`
      }
      if (tax['Name Französisch']) {
        googleBilderLink += '+OR+"' + tax['Name Französisch'] + '"'
      }
      if (tax['Name Italienisch']) {
        googleBilderLink += '+OR+"' + tax['Name Italienisch'] + '"'
      }
      break
    case 'Fauna':
      googleBilderLink += tax.Artname + '"'
      if (tax['Name Deutsch']) {
        googleBilderLink += '+OR+"' + tax['Name Deutsch'] + '"'
      }
      if (tax['Name Französisch']) {
        googleBilderLink += '+OR+"' + tax['Name Französisch'] + '"'
      }
      if (tax['Name Italienisch']) {
        googleBilderLink += '+OR"' + tax['Name Italienisch'] + '"'
      }
      break
    case 'Moose':
      googleBilderLink += tax.Gattung + ' ' + tax.Art + '"'
      break
    case 'Macromycetes':
      googleBilderLink += tax.Name + '"'
      if (tax['Name Deutsch']) {
        googleBilderLink += '+OR+"' + tax['Name Deutsch'] + '"'
      }
      break
    case 'Lebensräume':
      googleBilderLink += tax.Einheit
      break
  }

  window.open(googleBilderLink)
}
