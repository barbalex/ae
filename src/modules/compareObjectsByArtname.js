'use strict'

export default function (a, b) {
  if (a.Taxonomie && a.Taxonomie.Eigenschaften && a.Taxonomie.Eigenschaften['Artname vollständig'] && b.Taxonomie && b.Taxonomie.Eigenschaften && b.Taxonomie.Eigenschaften['Artname vollständig']) {
    const aName = a.Taxonomie.Eigenschaften['Artname vollständig']
    const bName = b.Taxonomie.Eigenschaften['Artname vollständig']

    if (aName < bName) { return -1 }
    if (aName > bName) { return 1 }
  }
  return 0
}
