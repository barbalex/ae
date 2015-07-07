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
  const level = path.length
  let nextPath = []

  // console.log('buildNextLevel:  property:', property)
  // console.log('buildNextLevel: path:', path)
  // console.log('buildNextLevel: level:', level)
  // console.log('buildNextLevel: objects:', objects)

  // if (property) {
  if (objects.length > 1) {
    const propertiesOfNextLevel = _.groupBy(objects, function (objekt) {
      if (objekt.Taxonomie && objekt.Taxonomie.Eigenschaften && objekt.Taxonomie.Eigenschaften.Hierarchie && objekt.Taxonomie.Eigenschaften.Hierarchie[level] && objekt.Taxonomie.Eigenschaften.Hierarchie[level].Name) return objekt.Taxonomie.Eigenschaften.Hierarchie[level].Name
    })
    // if objects had no next hierarchy with name, undefined is returned
    if (propertiesOfNextLevel.undefined) delete propertiesOfNextLevel.undefined

    // console.log('buildNextLevel: ' + Object.keys(propertiesOfNextLevel).length + ' properties of Level ' + level + ':', propertiesOfNextLevel)

    if (propertiesOfNextLevel) {
      passPropertyToHierarchieObject(propertiesOfNextLevel, path, gruppe)
      // console.log('buildHierarchyObjectForParent.js: propertiesOfNextLevel', propertiesOfNextLevel)
      _.forEach(propertiesOfNextLevel, function (values, property) {
        nextPath = _.clone(path)
        nextPath.push(property)
        buildNextLevel(property, nextPath, values)
      })
    }
  } else {
    // console.log('buildNextLevel: objects.length = 0,  property:', property)
    // console.log('buildNextLevel: objects.length = 0,  objects:', objects)
    // console.log('buildNextLevel: objects.length = 0,  objects[0]:', objects[0])
    // console.log('buildNextLevel: objects.length = 0,  objects[0]._id:', objects[0]._id)
    setTimeout(function () {
      passPropertyToHierarchieObject(objects[0]._id, path, gruppe)
    }, 500)
  }
}

export default function (objects) {

  // console.log('buildHierarchyObjectForParent.js: objects', objects)

  // prepare hierarchieObject
  app.hierarchieObject = app.hierarchieObject || {}
  app.hierarchieObject[gruppe] = {}

  // build first level
  const propertiesOfLevel1 = _.groupBy(objects, function (objekt) {
    if (objekt.Taxonomie && objekt.Taxonomie.Name) return objekt.Taxonomie.Name
  })

  app.hierarchieObject[gruppe] = propertiesOfLevel1

  // console.log('buildHierarchyObjectForParent.js: ' + Object.keys(propertiesOfLevel1).length + ' properties of Level 1:', propertiesOfLevel1)

  // buildNextLevel('Agrofutura (2004): Wiesenkartierschlüssel', ['Agrofutura (2004): Wiesenkartierschlüssel'], propertiesOfLevel1['Agrofutura (2004): Wiesenkartierschlüssel'])

  // get next level built
  _.forEach(propertiesOfLevel1, function (values, property) {
    const path = [property]
    buildNextLevel(property, path, values)
  })

  return app.hierarchieObject[gruppe]
}
