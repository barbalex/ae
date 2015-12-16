'use strict'

import { isArray } from 'lodash'

export default (roles) => {
  // test input
  if (!roles || !isArray(roles)) return false
  // check if user is admin for any org
  const adminRoles = roles.map((role) => role.endsWith(' org'))
  return adminRoles.length > 0
}
