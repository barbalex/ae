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

function buildNodeName (object, level) {
  if (level === 1) {
    return object.Taxonomie.Name
  } else {
    return object.Taxonomie.Eigenschaften.Label + ': ' + object.Taxonomie.Eigenschaften.Einheit
  }
}

function buildNextLevel (path, level, objectsOfThisKey) {
  // get level objects
  

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
  buildNextLevel([], level, objects)
  return app.hierarchieObject.Lebensräume
}
