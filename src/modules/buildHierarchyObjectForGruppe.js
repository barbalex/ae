/*
 * build an object composed of the Hierarchies, Names and GUID's
 * GUID's mark that this object can be shown
 * example:
    {
      'Fauna': {
        'Name': 'Fauna',
        'Hierarchie': {
          'Amphibia': {
            'Name': 'Amphibia',
            'Hierarchie': {
              'Anura': {
                'Name': 'Anura',
                'Hierarchie': {
                  'Bufonidae': {
                    'Name': 'Bufonidae',
                    'Hierarchie': {
                      'Bufo bufo (Linnaeus, 1758) (Erdkröte)': {
                        'Name': 'Bufo bufo (Linnaeus, 1758) (Erdkröte)',
                        'GUID': '979233B6-9013-4820-9F7D-8ED9D826C2D3'
                      }
                      ...
                    }
                  }
                  ...
                }
              }
              ...
            }
          }
          ...
        }
      }
      'Flora': ...
      'Moose': ...
      ...
    }
 * the function recieves the objects of a group
 * it builds app.hierarchieObject[gruppe]
 * building principle:
 * 0. use the array in Eigenschaften.Hierarchie of the desired taxonomy
 * 1. build first level (first element)
 * 2. build the next level for each member of the passed in level
 * 3. repeat until there is no more hierarchy object
 *
 * later this function can be changed to build hierarchy objects for taxonomies
 * in the meantime Taxonomien[0] is used
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'
import passPropertyToHierarchieObject from './passPropertyToHierarchieObject.js'

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

export default function (objects, gruppe) {
  // prepare hierarchieObject
  app.hierarchieObject = app.hierarchieObject || {}
  app.hierarchieObject[gruppe] = {}

  // extract Hierarchie from objects
  const hierarchiesArray = _.map(objects, function (object) {
    if (object.Taxonomien[0].Eigenschaften.Hierarchie) return _.get(object, 'Taxonomien[0].Eigenschaften.Hierarchie')
  })
  const hierarchies = _.groupBy(hierarchiesArray, function (object) {
    if (object.Name) return object.Name
  })

  app.hierarchieObject[gruppe] = hierarchies

  // build next level
  _.forEach(hierarchies, function (hierarchy, key) {
    const path = [key]
    buildNextLevel(key, path, hierarchy)
  })

  return app.hierarchieObject[gruppe]
}
