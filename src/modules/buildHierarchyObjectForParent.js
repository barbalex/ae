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

function buildNodeName (object, level) {
  if (level === 1) {
    return object.Taxonomie.Name
  } else {
    return object.Taxonomie.Eigenschaften.Label + ': ' + object.Taxonomie.Eigenschaften.Einheit
  }
}

function buildNextLevel (path, level, property, objects) {
  // get level objects
  const objectsOfNextLevel = _.indexBy(objects, function (object) {
    return object.Taxonomie.Parent.GUID === parentObject._id
  })
  _.forEach(objectsOfNextLevel, function (object) {
    path.push()
    buildNextLevel(object, level, objects)
  })
}

export default function (objects, hierarchieDoc) {
  let level = 1
  // build first level
  const propertiesOfLevel1 = _.indexBy(objects, function (object) {
    return object.Taxonomie.Name
  })
  // get next level built
  _.forEach(propertiesOfLevel1, function (property) {
    const path = []
    path.push(property)
    passPropertyToHierarchieObject(property, path, gruppe)
    buildNextLevel(path, level, property, objects)
  })

  return app.hierarchieObject.Lebensräume
}
