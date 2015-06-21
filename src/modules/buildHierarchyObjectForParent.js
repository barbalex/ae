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
let property = {}

function buildKeyName (object) {
  return object.Taxonomie.Eigenschaften.Label + ': ' + object.Taxonomie.Eigenschaften.Einheit
}

function buildNextLevel (path, level, objects) {
  // get level objects
  const propertiesOfNextLevel = _.indexBy(objects, function (object) {
    return buildKeyName(object)
  })
  _.forEach(propertiesOfNextLevel, function (objects, key) {
    path.push(key)
    buildNextLevel(path, level, objects)
  })
}

export default function (objects, hierarchieDoc) {
  let level = 1
  // build first level
  const propertiesOfLevel1 = _.indexBy(objects, function (object) {
    return object.Taxonomie.Name
  })
  // get objects of first level
  const objectsOfLevel1 = _.indexBy(objects, function (object) {
    return object._id === object.Taxonomie.Eigenschaften.Parent.GUID
  })
  // get next level built
  _.forEach(propertiesOfLevel1, function (objects, key) {
    const path = []
    path.push(key)
    passPropertyToHierarchieObject(key, path, gruppe)
    buildNextLevel(path, level, objects)
  })

  return app.hierarchieObject.Lebensräume
}
