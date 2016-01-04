'use strict'

/**
 * gets an object and the name of a taxonomy
 * builds a taxonomy object for the taxonomy with this name
 * returns this or null of none could be built
 */

export default (object, taxonomyName) => {
  const gruppe = object.Gruppe
  const taxonomies = object.Taxonomien
  if (taxonomies && gruppe) {
    const taxonomy = taxonomies.find((taxonomy) => taxonomy.Name === taxonomyName)
    if (taxonomy && taxonomy.Eigenschaften) {
      const artname = taxonomy.Eigenschaften['Artname vollständig']
      if (gruppe !== 'Lebensräume' && artname) {
        return {
          Name: artname,
          GUID: object._id
        }
      }
      const einheit = taxonomy.Eigenschaften.Einheit
      if (gruppe === 'Lebensräume' && einheit) {
        const label = taxonomy.Eigenschaften.Label
        const name = label ? `${label}: ${einheit}` : einheit
        return {
          Name: name,
          GUID: object._id
        }
      }
    }
  }
  return null
}