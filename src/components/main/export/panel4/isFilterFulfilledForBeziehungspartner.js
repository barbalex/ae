'use strict'

import isFilterFulfilled from './isFilterFulfilled.js'

export default (rPartners, filterValue, co) => {
  let rPartnersToReturn = []
  if (rPartners && rPartners.length > 0) {
    rPartners.forEach((rPartner) => {
      if (isFilterFulfilled(rPartner.Name, filterValue, co) || isFilterFulfilled(rPartner.GUID, filterValue, co)) {
        rPartnersToReturn.push(rPartner)
      }
    })
  }
  return rPartnersToReturn
}
