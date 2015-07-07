/*
 * build an object composed of the paths
 * example (similar for lr):
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
  if (objects.length > 1) {
    const level = path.length
    let nextPath = []

    const propertiesOfNextLevel = _.groupBy(objects, function (objekt) {
      if (objekt.Taxonomie && objekt.Taxonomie.Eigenschaften && objekt.Taxonomie.Eigenschaften.Hierarchie && objekt.Taxonomie.Eigenschaften.Hierarchie[level] && objekt.Taxonomie.Eigenschaften.Hierarchie[level].Name) return objekt.Taxonomie.Eigenschaften.Hierarchie[level].Name
    })

    if (propertiesOfNextLevel) {
      passPropertyToHierarchieObject(propertiesOfNextLevel, path, gruppe)
      _.forEach(propertiesOfNextLevel, function (values, property) {
        nextPath = _.clone(path)
        nextPath.push(property)
        buildNextLevel(property, nextPath, values)
      })
    }
  } else {
    // this is last level
    passPropertyToHierarchieObject(objects[0]._id, path, gruppe)
  }
}

export default function (objects) {
  // prepare hierarchieObject
  app.hierarchieObject = app.hierarchieObject || {}
  app.hierarchieObject[gruppe] = {}

  // build first level
  const propertiesOfLevel1 = _.groupBy(objects, function (objekt) {
    if (objekt.Taxonomie && objekt.Taxonomie.Name) return objekt.Taxonomie.Name
  })

  app.hierarchieObject[gruppe] = propertiesOfLevel1

  // build next level
  _.forEach(propertiesOfLevel1, function (values, property) {
    const path = [property]
    buildNextLevel(property, path, values)
  })

  return app.hierarchieObject[gruppe]
}
