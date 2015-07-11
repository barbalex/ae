/*
 * build an object composed of the Hierarchies, Names and GUID's
 * GUID's mark that this object can be shown
 * example:
    {
      'name': 'Fauna',
      'children': [
        {
          'name': 'Amphibia',
          'children': [
            {
              'name': 'Anura',
              'children': [
                {
                  'name': 'Bufonidae',
                  'children': [
                    {
                      'name': 'Bufo bufo (Linnaeus, 1758) (Erdkröte)',
                      'guid': '979233B6-9013-4820-9F7D-8ED9D826C2D3'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
 * the function recieves the objects of a group
 * it builds hierarchy
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

function checkLevel1 (hierarchy, hArray) {
  const el1 = _.find(hierarchy, function (el) {
    return el.name === hArray[0].name
  })
  if (!el1) hierarchy.push(hArray[0])
}

function checkLevel2 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.name === hArray[0].name
  })

  const el2 = _.find(el1.children, function (el) {
    return el.name === hArray[1].name
  })
  if (!el2) hierarchy.push(hArray[1])
}

export default function (objects, gruppe) {
  // prepare hierarchieObject
  let hierarchy = []

  // extract Hierarchie from objects
  const hierarchiesArray = _.map(objects, function (object) {
    if (object.Taxonomien[0].Eigenschaften.Hierarchie) return _.get(object, 'Taxonomien[0].Eigenschaften.Hierarchie')
  })

  _.forEach(hierarchiesArray, function (hArray) {
    let el1, el2, el3, el4, el5, el6, el7
    switch (hArray.length) {
    case 1:
      checkLevel1(hierarchy, hArray)
      break
    case 2:
      checkLevel2(hierarchy, hArray)
      break
    /*case 3:
      hierarchy.children[hArray[1]].children[hArray[2]] = objectToPass
      break
    case 4:
      hierarchy.children[hArray[1]].children[hArray[2]].children[hArray[3]].children = objectToPass
      break
    case 5:
      hierarchy.children[hArray[1]].children[hArray[2]].children[hArray[3]].children[hArray[4]].children = objectToPass
      break
    case 6:
      hierarchy.children[hArray[1]].children[hArray[2]].children[hArray[3]].children[hArray[4]].children[hArray[5]].children = objectToPass
      break
    case 7:
      hierarchy.children[hArray[1]].children[hArray[2]].children[hArray[3]].children[hArray[4]].children[hArray[5]].children[hArray[6]].children = objectToPass
      break
    case 8:
      hierarchy.children[hArray[1]].children[hArray[2]].children[hArray[3]].children[hArray[4]].children[hArray[5]].children[hArray[6]].children[hArray[7]].children = objectToPass
      break
    case 9:
      hierarchy.children[hArray[1]].children[hArray[2]].children[hArray[3]].children[hArray[4]].children[hArray[5]].children[hArray[6]].children[hArray[7]].children[hArray[8]].children = objectToPass
      break*/
    }
  })

  return gruppeItem
}
