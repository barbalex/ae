'use strict'

import { isArray, isString } from 'lodash'

export default (roles, org) => {
  // test input
  if (!roles || !isArray(roles)) return false
  if (!org || !isString(org)) return false
  // check if user is admin for org
  const orgAdminRole = `${org} org`
  return roles.includes(orgAdminRole)
}
