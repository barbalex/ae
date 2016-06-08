import isFilterFulfilled from './isFilterFulfilled.js'

export default (rPartners, filterValue, co) => {
  const rPartnersToReturn = []
  if (rPartners && rPartners.length) {
    rPartners.forEach((rPartner) => {
      if (
        isFilterFulfilled(rPartner.Name, filterValue, co) ||
        isFilterFulfilled(rPartner.GUID, filterValue, co)
      ) {
        rPartnersToReturn.push(rPartner)
      }
    })
  }
  return rPartnersToReturn
}
