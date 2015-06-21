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

function buildKeyName (object) {
  if (object && object.Taxonomie && object.Taxonomie.Eigenschaften && object.Taxonomie.Eigenschaften.Label && object.Taxonomie.Eigenschaften.Einheit) {
    return object.Taxonomie.Eigenschaften.Label + ': ' + object.Taxonomie.Eigenschaften.Einheit
  }
  return '(unbekannte Einheit)'
}

function buildNextLevel (path, level, objects) {

  console.log('buildHierarchyObjectForParent.js: number of objects at level ' + level + ' and path ' + path + ':', objects.length)

  // get level objects
  const propertiesOfNextLevel = _.indexBy(objects, function (object) {
    return buildKeyName(object)
  })

  console.log('buildHierarchyObjectForParent.js: propertiesOfNextLevel', propertiesOfNextLevel)

  _.forEach(propertiesOfNextLevel, function (objects, key) {
    path.push(key)
    passPropertyToHierarchieObject(key, path, gruppe)
    buildNextLevel(path, level + 1, objects)
  })
}

export default function (objects, hierarchieDoc) {
  let level = 1
  // build first level
  const propertiesOfLevel1 = _.groupBy(objects, function (object) {
    return object.Taxonomie.Name
  })

  console.log('buildHierarchyObjectForParent.js: propertiesOfLevel1', propertiesOfLevel1)
  console.log('buildHierarchyObjectForParent.js: number of objects at level ' + level + ':', objects.length)

  app.hierarchieObject = app.hierarchieObject || {}
  app.hierarchieObject[gruppe] = {}

  // get next level built
  _.forEach(propertiesOfLevel1, function (objects, key) {

    console.log('buildHierarchyObjectForParent.js: forEach propertiesOfLevel1: key', key)
    console.log('buildHierarchyObjectForParent.js: forEach propertiesOfLevel1: objects', objects)

    const path = []
    path.push(key)
    passPropertyToHierarchieObject(key, path, gruppe)
    buildNextLevel(path, level + 1, objects)
  })

  return app.hierarchieObject[gruppe]
}
