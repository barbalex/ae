'use strict'

import { isArray, isString } from 'lodash'

export default (roles, org) => {
  // test input
  if (!roles || !isArray(roles)) return false
  if (!org || !isString(org)) return false
  // check if user is taxWriter for org
  const taxWriterRole = `${org} tax`
  return roles.includes(taxWriterRole)
}
