'use strict'

import { has, pluck } from 'lodash'
import replaceProblematicPathCharactersFromArray from './replaceProblematicPathCharactersFromArray.js'

export default (object) => {
  if (object.Taxonomien) {
    const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy['Standardtaxonomie'])
    if (standardtaxonomie && has(standardtaxonomie, 'Eigenschaften.Hierarchie')) {
      let path = pluck(standardtaxonomie.Eigenschaften.Hierarchie, 'Name')
      path = replaceProblematicPathCharactersFromArray(path)
      if (path[0] !== object.Gruppe) path.unshift(object.Gruppe)
      return path
    }
  }
  return null
}

