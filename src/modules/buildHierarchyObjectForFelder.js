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

let hierarchieFelder = []

function buildNextLevel (path, level, objectsOfThisKey, gruppe) {
  // group objects by this level
  const feld = hierarchieFelder[level - 1]
  let property = {}

  if (hierarchieFelder.length === level) {
    // last level > build keys
    _.forEach(objectsOfThisKey, function (object) {
      property[object.Taxonomie.Eigenschaften[feld]] = object._id
    })
    passPropertyToHierarchieObject(property, path, gruppe)
  } else {
    // hierarchy level > build keys with indexBy
    property = _.groupBy(objectsOfThisKey, function (object) {
      return object.Taxonomie.Eigenschaften[hierarchieFelder[level - 1]]
    })
    passPropertyToHierarchieObject(property, path, gruppe)

    // then build next level for each key
    level++
    _.forEach(property, function (value, key) {
      let nextPath = _.clone(path)
      nextPath.push(key)
      buildNextLevel(nextPath, level, value, gruppe)
    })
  }
}

export default function (objects, hierarchieDoc) {
  let level = 1
  hierarchieFelder = hierarchieDoc.HierarchieFelder
  const object0 = objects[0]
  const gruppe = object0.Gruppe
  app.hierarchieObject = app.hierarchieObject || {}
  app.hierarchieObject[gruppe] = {}
  buildNextLevel([], level, objects, gruppe)
  return app.hierarchieObject[gruppe]
}
