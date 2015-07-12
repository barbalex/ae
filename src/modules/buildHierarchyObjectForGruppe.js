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

import _ from 'lodash'

function checkLevel1 (hierarchy, hArray) {
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  if (!el1) {
    const newEl1 = _.clone(hArray[0])
    newEl1.children = []
    hierarchy.push(newEl1)
  }
}

function checkLevel2 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  if (!el2) {
    const newEl2 = _.clone(hArray[1])
    newEl2.children = []
    hierarchy.push(newEl2)
    el1.children.push(newEl2)
  }
}

function checkLevel3 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  const el3 = _.find(el2.children, function (el) {
    return el.Name === hArray[2].Name
  })
  if (!el3) {
    const newEl3 = _.clone(hArray[2])
    newEl3.children = []
    hierarchy.push(newEl3)
    el2.children.push(newEl3)
  }
}

function checkLevel4 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  checkLevel3(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  const el3 = _.find(el2.children, function (el) {
    return el.Name === hArray[2].Name
  })
  const el4 = _.find(el3.children, function (el) {
    return el.Name === hArray[3].Name
  })
  if (!el4) {
    const newEl4 = _.clone(hArray[3])
    newEl4.children = []
    hierarchy.push(newEl4)
    el3.children.push(newEl4)
  }
}

function checkLevel5 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  checkLevel3(hierarchy, hArray)
  checkLevel4(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  const el3 = _.find(el2.children, function (el) {
    return el.Name === hArray[2].Name
  })
  const el4 = _.find(el3.children, function (el) {
    return el.Name === hArray[3].Name
  })
  const el5 = _.find(el4.children, function (el) {
    return el.Name === hArray[4].Name
  })
  if (!el5) {
    const newEl5 = _.clone(hArray[4])
    newEl5.children = []
    hierarchy.push(newEl5)
    el4.children.push(newEl5)
  }
}

function checkLevel6 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  checkLevel3(hierarchy, hArray)
  checkLevel4(hierarchy, hArray)
  checkLevel5(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  const el3 = _.find(el2.children, function (el) {
    return el.Name === hArray[2].Name
  })
  const el4 = _.find(el3.children, function (el) {
    return el.Name === hArray[3].Name
  })
  const el5 = _.find(el4.children, function (el) {
    return el.Name === hArray[4].Name
  })
  const el6 = _.find(el5.children, function (el) {
    return el.Name === hArray[5].Name
  })
  if (!el6) {
    const newEl6 = _.clone(hArray[5])
    newEl6.children = []
    hierarchy.push(newEl6)
    el5.children.push(newEl6)
  }
}

function checkLevel7 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  checkLevel3(hierarchy, hArray)
  checkLevel4(hierarchy, hArray)
  checkLevel5(hierarchy, hArray)
  checkLevel6(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  const el3 = _.find(el2.children, function (el) {
    return el.Name === hArray[2].Name
  })
  const el4 = _.find(el3.children, function (el) {
    return el.Name === hArray[3].Name
  })
  const el5 = _.find(el4.children, function (el) {
    return el.Name === hArray[4].Name
  })
  const el6 = _.find(el5.children, function (el) {
    return el.Name === hArray[5].Name
  })
  const el7 = _.find(el6.children, function (el) {
    return el.Name === hArray[6].Name
  })
  if (!el7) {
    const newEl7 = _.clone(hArray[6])
    newEl7.children = []
    hierarchy.push(newEl7)
    el6.children.push(newEl7)
  }
}

function checkLevel8 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  checkLevel3(hierarchy, hArray)
  checkLevel4(hierarchy, hArray)
  checkLevel5(hierarchy, hArray)
  checkLevel6(hierarchy, hArray)
  checkLevel7(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  const el3 = _.find(el2.children, function (el) {
    return el.Name === hArray[2].Name
  })
  const el4 = _.find(el3.children, function (el) {
    return el.Name === hArray[3].Name
  })
  const el5 = _.find(el4.children, function (el) {
    return el.Name === hArray[4].Name
  })
  const el6 = _.find(el5.children, function (el) {
    return el.Name === hArray[5].Name
  })
  const el7 = _.find(el6.children, function (el) {
    return el.Name === hArray[6].Name
  })
  const el8 = _.find(el7.children, function (el) {
    return el.Name === hArray[7].Name
  })
  if (!el8) {
    const newEl8 = _.clone(hArray[7])
    newEl8.children = []
    hierarchy.push(newEl8)
    el7.children.push(newEl8)
  }
}

function checkLevel9 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  checkLevel3(hierarchy, hArray)
  checkLevel4(hierarchy, hArray)
  checkLevel5(hierarchy, hArray)
  checkLevel6(hierarchy, hArray)
  checkLevel7(hierarchy, hArray)
  checkLevel8(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  const el3 = _.find(el2.children, function (el) {
    return el.Name === hArray[2].Name
  })
  const el4 = _.find(el3.children, function (el) {
    return el.Name === hArray[3].Name
  })
  const el5 = _.find(el4.children, function (el) {
    return el.Name === hArray[4].Name
  })
  const el6 = _.find(el5.children, function (el) {
    return el.Name === hArray[5].Name
  })
  const el7 = _.find(el6.children, function (el) {
    return el.Name === hArray[6].Name
  })
  const el8 = _.find(el7.children, function (el) {
    return el.Name === hArray[7].Name
  })
  const el9 = _.find(el8.children, function (el) {
    return el.Name === hArray[8].Name
  })
  if (!el9) {
    const newEl9 = _.clone(hArray[8])
    newEl9.children = []
    hierarchy.push(newEl9)
    el8.children.push(newEl9)
  }
}

export default function (objects, gruppe) {
  // prepare hierarchieObject
  let hierarchy = []
  window.hierarchy = hierarchy

  // extract Hierarchie from objects
  const hierarchiesArray = _.map(objects, function (object) {
    if (object.Taxonomien[0].Eigenschaften.Hierarchie) return _.get(object, 'Taxonomien[0].Eigenschaften.Hierarchie')
  })

  _.forEach(hierarchiesArray, function (hArray) {
    switch (hArray.length) {
    case 1:
      checkLevel1(hierarchy, hArray)
      break
    case 2:
      checkLevel2(hierarchy, hArray)
      break
    case 3:
      checkLevel3(hierarchy, hArray)
      break
    case 4:
      checkLevel4(hierarchy, hArray)
      break
    case 5:
      checkLevel5(hierarchy, hArray)
      break
    case 6:
      checkLevel6(hierarchy, hArray)
      break
    case 7:
      checkLevel7(hierarchy, hArray)
      break
    case 8:
      checkLevel8(hierarchy, hArray)
      break
    case 9:
      checkLevel9(hierarchy, hArray)
      break
    }
  })

  return hierarchy
}
