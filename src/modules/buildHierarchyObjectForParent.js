/*
 * build an object composed of the paths
 * example:
 * {
 *   'Amphibia': {
 *     'Anura': {
 *       'Bufonidae': {
 *         'Bufo bufo (Linnaeus, 1758) (Erdkröte)': '979233B6-9013-4820-9F7D-8ED9D826C2D3',
 *         'Bufo calamita Laurenti, 1768 (Kreuzkröte)': 'CA529422-0ED4-4BFD-94A2-4E788AEB9D70'
 *       }
 *     }
 *   }
 * }
 */
'use strict'

import app from 'ampersand-app'
import _ from 'lodash'
import passPropertyToHierarchieObject from './passPropertyToHierarchieObject.js'

const gruppe = 'Lebensräume'

function buildNextLevel (property, path, objects) {
  if (objects.length > 0) {
    let nextPath = _.clone(path)
    nextPath.push(property)
    const level = nextPath.length

    const propertiesOfNextLevel = _.groupBy(objects, function (object) {
      if (object.Taxonomie && object.Taxonomie.Eigenschaften && object.Taxonomie.Eigenschaften.Hierarchie && object.Taxonomie.Eigenschaften.Hierarchie[level] && object.Taxonomie.Eigenschaften.Hierarchie[level].Name) return object.Taxonomie.Eigenschaften.Hierarchie[level].Name
    })

    console.log('buildHierarchyObjectForParent.js: ' + Object.keys(propertiesOfNextLevel).length + ' properties of Level ' + level + ':', propertiesOfNextLevel)

    // if (propertiesOfNextLevel['undefined']) delete propertiesOfNextLevel.undefined

    passPropertyToHierarchieObject(propertiesOfNextLevel, nextPath, gruppe)

    // console.log('buildHierarchyObjectForParent.js: propertiesOfNextLevel', propertiesOfNextLevel)

    /*_.forEach(propertiesOfNextLevel, function (values, property) {
      buildNextLevel(property, path, values)
    })*/
  }
}

export default function (objects) {

  // console.log('buildHierarchyObjectForParent.js: objects', objects)

  // prepare hierarchieObject
  app.hierarchieObject = app.hierarchieObject || {}
  app.hierarchieObject[gruppe] = {}

  // build first level
  const propertiesOfLevel1 = _.groupBy(objects, function (object) {
    if (object.Taxonomie && object.Taxonomie.Name) return object.Taxonomie.Name
  })

  console.log('buildHierarchyObjectForParent.js: ' + Object.keys(propertiesOfLevel1).length + ' properties of Level 1:', propertiesOfLevel1)

  const path = []
  passPropertyToHierarchieObject(propertiesOfLevel1, path, gruppe)

  buildNextLevel('Agrofutura (2004): Wiesenkartierschlüssel', path, propertiesOfLevel1['Agrofutura (2004): Wiesenkartierschlüssel'])

  // get next level built
  /*_.forEach(propertiesOfLevel1, function (values, property) {
    buildNextLevel(property, path, values)
  })*/

  return app.hierarchieObject[gruppe]
}
