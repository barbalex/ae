export default (object) => {
  let link = '#'
  if (object && object.Taxonomien) {
    const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy.Standardtaxonomie)
    if (standardtaxonomie && standardtaxonomie.Eigenschaften) {
      const properties = standardtaxonomie.Eigenschaften
      const { Artname, Gattung, Art, Name, Einheit } = properties
      link = 'https://www.google.ch/search?tbm=isch&q='

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
        default:
          link += `"${Einheit}"`
      }
    }
  }
  return link
}
