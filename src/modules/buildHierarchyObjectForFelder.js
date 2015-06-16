'use strict'

import _ from 'lodash'

function buildNextLevel (keyOfHierarchieObjekt, level, hierarchieFelder, objectsOfThisKey) {
  // group objects by this level
  const feld = hierarchieFelder[level]
  if (hierarchieFelder.length === level) {
    // last level > build keys
    _.forEach(keyOfHierarchieObjekt, function (object) {
      keyOfHierarchieObjekt[feld] = keyOfHierarchieObjekt[object._id]
    })
  } else {
    // hierarchy level > build keys with indexBy
    keyOfHierarchieObjekt = _.groupBy(objectsOfThisKey, function (object) {
      if (level === 1) return object[hierarchieFelder[0]]
      if (level === 2) return object[hierarchieFelder[0]][hierarchieFelder[1]]
      if (level === 3) return object[hierarchieFelder[0]][hierarchieFelder[1]][hierarchieFelder[2]]
      if (level === 4) return object[hierarchieFelder[0]][hierarchieFelder[1]][hierarchieFelder[2]][hierarchieFelder[3]]
      if (level === 5) return object[hierarchieFelder[0]][hierarchieFelder[1]][hierarchieFelder[2]][hierarchieFelder[3]][hierarchieFelder[4]]
      if (level === 6) return object[hierarchieFelder[0]][hierarchieFelder[1]][hierarchieFelder[2]][hierarchieFelder[3]][hierarchieFelder[4]][hierarchieFelder[5]]
    })
    // then build next level for each key
    _.forEach(keyOfHierarchieObjekt[feld], function (key, value) {
      buildNextLevel(keyOfHierarchieObjekt[feld], level++, hierarchieFelder, keyOfHierarchieObjekt[feld])
    })
  }
}

export default function (objects, hierarchieDoc) {
  // build an object composed of the paths
  // example:
  // {
  //   'Amphibia': {
  //     'Anura': {
  //       'Bufonidae': {
  //         'Bufo bufo (Linnaeus, 1758) (Erdkröte)': '979233B6-9013-4820-9F7D-8ED9D826C2D3',
  //         'Bufo calamita Laurenti, 1768 (Kreuzkröte)': 'CA529422-0ED4-4BFD-94A2-4E788AEB9D70'
  //       }
  //     }
  //   }
  // }
  let level = 1
  let hierarchieObject = {}
  const hierarchieFelder = hierarchieDoc.HierarchieFelder

  buildNextLevel(hierarchieObject, level, hierarchieFelder, objects)
  return hierarchieObject
}
